import Phaser from 'phaser';
import {
  Board,
  BoardGestureController,
  EngineEvent,
  EngineScene,
  ItemRegistry,
  ItemStore,
  MergeFlow,
  SaveManager,
  mergeRuleLoader,
  type BoardPosition,
  type DropResolution,
  type ItemInstance,
} from '@merge-engine/core';
import { ASSET_MANIFEST, GAME_CONTENT, type ItemVisualConfig } from '../config/content';
import { LocalSaveStore } from '../storage/LocalSaveStore';
import { TruckSystem } from '../systems/TruckSystem';
import { VillageState } from '../systems/VillageState';
import type { VillageMergeSaveData } from '../types/save';

type DropPreviewType = 'move' | 'merge' | 'swap' | 'reject' | 'noop';

interface DropPreviewStyle {
  fill: number;
  stroke: number;
  message: string;
}

interface PendingDrag {
  itemId: string;
  pointerId: number;
  position: BoardPosition;
  startX: number;
  startY: number;
}

const SAVE_KEY = 'village-merge-save-v1';
const DRAG_THRESHOLD = 6;
const CELL_INSET = 3;
const CELL_DRAW_SIZE = 42;

const DROP_PREVIEW_STYLES: Record<DropPreviewType, DropPreviewStyle> = {
  move: { fill: 0x67d39a, stroke: 0x2ca86e, message: 'Release to move' },
  merge: { fill: 0xffdf6f, stroke: 0xffaa1f, message: 'Release to merge' },
  swap: { fill: 0x7ca7ff, stroke: 0x4f6fe8, message: 'Release to swap' },
  reject: { fill: 0xff7f7f, stroke: 0xd94848, message: 'Cannot drop here' },
  noop: { fill: 0xd7dee8, stroke: 0x8d9bad, message: 'Original cell' },
};

export class MainScene extends EngineScene {
  private board!: Board;
  private gestureController!: BoardGestureController;
  private itemRegistry = new ItemRegistry();
  private itemStore!: ItemStore;
  private mergeFlow!: MergeFlow;
  private truck!: TruckSystem;
  private village!: VillageState;

  private boardGraphics!: Phaser.GameObjects.Graphics;
  private cargoButton!: Phaser.GameObjects.Text;
  private debugText!: Phaser.GameObjects.Text;
  private eventText!: Phaser.GameObjects.Text;
  private hoverHighlight!: Phaser.GameObjects.Graphics;
  private resetButton!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private truckText!: Phaser.GameObjects.Text;
  private villageGraphics!: Phaser.GameObjects.Graphics;
  private villageIcon?: Phaser.GameObjects.Image;
  private villageText!: Phaser.GameObjects.Text;

  private activePointerId?: number;
  private debugVisible = false;
  private draggedItemId?: string;
  private lastHudUpdate = 0;
  private pendingDrag?: PendingDrag;
  private readonly finalizingItemIds = new Set<string>();
  private readonly gameSaveManager = new SaveManager<VillageMergeSaveData>('0.1.0');
  private readonly itemViews = new Map<string, Phaser.GameObjects.Container>();
  private readonly mergeLog: string[] = [];
  private readonly saveStore = new LocalSaveStore<VillageMergeSaveData>(SAVE_KEY);

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.assetManager.registerManifest(ASSET_MANIFEST);
    this.assetManager.preload(this.load);
  }

  override create(): void {
    super.create();

    this.registerContent();
    this.restoreOrCreateState();
    this.bindEngineEvents();
    this.drawStage();
    this.syncItemViews(false);
    this.bindPointerInput();
    this.setStatus('Unload cargo, then merge into a coop');
    this.setEvent('Truck cargo becomes eggs. The coop leaves the board and enters the village.');
    this.updateHud(true);
    this.updateDebugText();
  }

  override update(time: number, delta: number): void {
    super.update(time, delta);

    const addedCargo = this.truck.update(Date.now());
    if (addedCargo > 0) {
      this.setEvent(`Truck delivered ${addedCargo} cargo`);
      this.saveGame();
    }

    if (time - this.lastHudUpdate > 250) {
      this.updateHud();
      this.lastHudUpdate = time;
    }
  }

  private registerContent(): void {
    this.itemRegistry = new ItemRegistry();
    this.itemRegistry.registerMany(GAME_CONTENT.items);
    this.mergeManager.setRules(mergeRuleLoader.load(GAME_CONTENT.mergeRules));
  }

  private restoreOrCreateState(): void {
    const saved = this.saveStore.load();
    if (saved) {
      try {
        const data = this.gameSaveManager.deserialize(saved);
        this.board = Board.deserialize(data.board, this.eventBus);
        this.itemStore = ItemStore.deserialize(data.items, this.eventBus);
        this.truck = new TruckSystem(GAME_CONTENT.truck, data.truck);
        this.village = new VillageState(data.village);
        this.createFlowControllers();
        return;
      } catch {
        this.saveStore.clear();
      }
    }

    this.createFreshState();
  }

  private createFreshState(): void {
    this.board = new Board(GAME_CONTENT.board, this.eventBus);
    this.itemStore = new ItemStore(this.eventBus);
    this.truck = new TruckSystem(GAME_CONTENT.truck);
    this.village = new VillageState();
    this.createFlowControllers();
    GAME_CONTENT.initialItems.forEach((item) => this.createItemAt(item.configId, item.position));
  }

  private createFlowControllers(): void {
    this.mergeFlow = new MergeFlow(this.mergeManager, this.eventBus);
    this.gestureController = new BoardGestureController(this.eventBus);
  }

  private bindEngineEvents(): void {
    this.eventBus.on(EngineEvent.MergeSuccess, ({ result }) => {
      const consumed = result.consumed.map((item) => this.getConfigLabel(item.configId)).join(' + ');
      const created = this.getConfigLabel(result.created.configId);
      this.mergeLog.unshift(`${consumed} -> ${created}`);
      this.mergeLog.splice(5);
      this.updateDebugText();
    });
  }

  private drawStage(): void {
    this.add.rectangle(195, 360, 390, 720, 0xf2e6c8);
    this.add.text(20, 24, 'Village Merge', {
      color: '#28313b',
      fontFamily: 'Arial',
      fontSize: '23px',
      fontStyle: 'bold',
    });

    this.statusText = this.add.text(20, 55, 'Ready', {
      color: '#52616f',
      fontFamily: 'Arial',
      fontSize: '14px',
    });

    this.eventText = this.add.text(20, 78, '', {
      color: '#758190',
      fixedWidth: 350,
      fontFamily: 'Arial',
      fontSize: '12px',
      lineSpacing: 3,
      wordWrap: { width: 350 },
    });

    this.drawTruckPanel();
    this.villageGraphics = this.add.graphics();
    this.villageText = this.add.text(286, 128, '', {
      align: 'center',
      color: '#52616f',
      fixedWidth: 66,
      fontFamily: 'Arial',
      fontSize: '11px',
      wordWrap: { width: 66 },
    });
    this.drawVillagePanel();

    this.cargoButton = this.createButton(20, 214, 'Open Cargo', 100, () => this.unloadCargo());
    this.resetButton = this.createButton(132, 214, 'Reset', 70, () => this.resetDemo());
    this.createButton(214, 214, 'Debug', 72, () => this.toggleDebug());

    this.boardGraphics = this.add.graphics();
    this.drawBoard();
    this.hoverHighlight = this.add.graphics();
    this.hoverHighlight.setVisible(false);

    this.debugText = this.add.text(20, 585, '', {
      color: '#52616f',
      fixedWidth: 350,
      fontFamily: 'Arial',
      fontSize: '11px',
      lineSpacing: 3,
      wordWrap: { width: 350 },
    });
    this.debugText.setVisible(false);
  }

  private drawTruckPanel(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xfff8e9, 1);
    graphics.fillRoundedRect(20, 108, 174, 88, 8);
    graphics.lineStyle(2, 0xd7c8a6, 1);
    graphics.strokeRoundedRect(20, 108, 174, 88, 8);
    graphics.fillStyle(0x8bb8da, 1);
    graphics.fillRoundedRect(34, 133, 58, 28, 7);
    graphics.fillStyle(0xf2c36b, 1);
    graphics.fillRoundedRect(78, 144, 26, 17, 5);
    graphics.fillStyle(0x35424a, 1);
    graphics.fillCircle(48, 166, 6);
    graphics.fillCircle(91, 166, 6);

    this.add.text(34, 116, 'Truck', {
      color: '#28313b',
      fontFamily: 'Arial',
      fontSize: '13px',
      fontStyle: 'bold',
    });
    this.truckText = this.add.text(112, 126, '', {
      color: '#52616f',
      fixedWidth: 70,
      fontFamily: 'Arial',
      fontSize: '12px',
      lineSpacing: 4,
    });
  }

  private drawVillagePanel(): void {
    this.villageGraphics.clear();
    this.villageGraphics.fillStyle(0xfff8e9, 1);
    this.villageGraphics.fillRoundedRect(214, 108, 150, 88, 8);
    this.villageGraphics.lineStyle(2, 0xd7c8a6, 1);
    this.villageGraphics.strokeRoundedRect(214, 108, 150, 88, 8);
    this.villageGraphics.fillStyle(0xc8df8f, 1);
    this.villageGraphics.fillRoundedRect(232, 130, 48, 34, 7);
    this.villageGraphics.lineStyle(1, 0x8ea45f, 1);
    this.villageGraphics.strokeRoundedRect(232, 130, 48, 34, 7);

    this.villageIcon?.destroy();
    const coopBuilt = this.village.has(GAME_CONTENT.village.targetBuildingId);
    if (coopBuilt && this.textures.exists('village_chicken_coop')) {
      this.villageIcon = this.add.image(256, 145, 'village_chicken_coop').setDisplaySize(42, 42);
    } else if (this.textures.exists('village_empty_lot')) {
      this.villageIcon = this.add.image(256, 146, 'village_empty_lot').setDisplaySize(40, 40);
    } else {
      this.villageIcon = undefined;
    }

    if (coopBuilt) {
      this.villageText.setText('Coop built\nVillage feels alive');
      return;
    }
    this.villageText.setText('Empty lot\nBuild the coop');
  }

  private drawBoard(): void {
    this.boardGraphics.clear();
    const padding = 12;
    const width = this.board.grid.columns * this.board.grid.cellSize;
    const height = this.board.grid.rows * this.board.grid.cellSize;
    const x = this.board.grid.originX - padding;
    const y = this.board.grid.originY - padding;

    this.boardGraphics.fillStyle(0xf7f0dd, 1);
    this.boardGraphics.fillRoundedRect(x, y, width + padding * 2, height + padding * 2, 10);
    this.boardGraphics.lineStyle(2, 0x9a8f78, 1);
    this.boardGraphics.strokeRoundedRect(x, y, width + padding * 2, height + padding * 2, 10);

    for (let cellY = 0; cellY < this.board.grid.rows; cellY += 1) {
      for (let cellX = 0; cellX < this.board.grid.columns; cellX += 1) {
        const topLeft = this.board.grid.toWorld({ x: cellX, y: cellY });
        this.boardGraphics.fillStyle(0xfff8e9, 1);
        this.boardGraphics.fillRoundedRect(
          topLeft.x + CELL_INSET,
          topLeft.y + CELL_INSET,
          CELL_DRAW_SIZE,
          CELL_DRAW_SIZE,
          8,
        );
        this.boardGraphics.lineStyle(1, 0xd7c8a6, 1);
        this.boardGraphics.strokeRoundedRect(
          topLeft.x + CELL_INSET,
          topLeft.y + CELL_INSET,
          CELL_DRAW_SIZE,
          CELL_DRAW_SIZE,
          8,
        );
      }
    }
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    width: number,
    onClick: () => void,
  ): Phaser.GameObjects.Text {
    const button = this.add
      .text(x, y, label, {
        backgroundColor: '#fff8e9',
        color: '#28313b',
        fixedWidth: width,
        fontFamily: 'Arial',
        fontSize: '13px',
        padding: { x: 8, y: 6 },
      })
      .setInteractive({ useHandCursor: true });
    button.on('pointerdown', onClick);
    button.on('pointerover', () => button.setBackgroundColor('#ffe9a8'));
    button.on('pointerout', () => button.setBackgroundColor('#fff8e9'));
    return button;
  }

  private bindPointerInput(): void {
    this.input.addPointer(2);
    this.input.on('pointermove', this.handlePointerMove, this);
    this.input.on('pointerup', this.handlePointerUp, this);
    this.input.on('pointerupoutside', this.handlePointerUp, this);
  }

  private handleItemPointerDown(itemId: string, pointer: Phaser.Input.Pointer): void {
    if (this.activePointerId !== undefined || this.finalizingItemIds.has(itemId)) {
      return;
    }

    const position = this.findItemPosition(itemId);
    if (!position) {
      return;
    }

    this.activePointerId = pointer.id;
    this.pendingDrag = {
      itemId,
      pointerId: pointer.id,
      position,
      startX: pointer.worldX,
      startY: pointer.worldY,
    };
    this.setEvent(`Grabbed ${this.getItemLabel(itemId)}`);
    this.updateDebugText();
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isActivePointer(pointer)) {
      return;
    }

    if (this.pendingDrag && !this.draggedItemId) {
      const distance = Phaser.Math.Distance.Between(
        this.pendingDrag.startX,
        this.pendingDrag.startY,
        pointer.worldX,
        pointer.worldY,
      );
      if (distance < DRAG_THRESHOLD) {
        return;
      }
      this.startPendingDrag(pointer);
    }

    if (!this.draggedItemId) {
      return;
    }

    const view = this.itemViews.get(this.draggedItemId);
    view?.setPosition(pointer.worldX, pointer.worldY);

    const position = this.board.grid.toCell(pointer.worldX, pointer.worldY);
    if (position) {
      this.gestureController.moveDragTo(position);
      const preview = this.getDropPreview(position);
      this.showHoverHighlight(position, preview);
      this.setEvent(DROP_PREVIEW_STYLES[preview].message);
    } else {
      this.hideHoverHighlight();
      this.setEvent('Out of board');
    }
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (!this.isActivePointer(pointer)) {
      return;
    }

    if (this.pendingDrag && !this.draggedItemId) {
      this.setEvent(`Selected ${this.getItemLabel(this.pendingDrag.itemId)}`);
      this.clearPointerState();
      return;
    }

    if (!this.draggedItemId) {
      this.clearPointerState();
      return;
    }

    const targetPosition = this.board.grid.toCell(pointer.worldX, pointer.worldY);
    if (!targetPosition) {
      this.gestureController.cancelDrag('OUT_OF_BOUNDS');
      this.setStatus('Returned');
      this.setEvent('Out of board');
      this.finishDrag(undefined, true);
      return;
    }

    const targetCell = this.board.getCell(targetPosition);
    if (targetCell?.itemId && this.finalizingItemIds.has(targetCell.itemId)) {
      this.gestureController.cancelDrag('TARGET_LOCKED');
      this.setStatus('Returned');
      this.setEvent('That building is moving into the village.');
      this.finishDrag(undefined, true);
      return;
    }

    const resolution = this.gestureController.endDragAt(
      this.board,
      this.itemStore,
      this.mergeFlow,
      targetPosition,
    );
    this.setStatus(this.describeResolution(resolution));
    this.setEvent(this.describeResolution(resolution));
    this.finishDrag(resolution, resolution?.type === 'reject' || resolution?.type === 'noop');
  }

  private startPendingDrag(pointer: Phaser.Input.Pointer): void {
    if (!this.pendingDrag) {
      return;
    }

    const pending = this.pendingDrag;
    const drag = this.gestureController.beginDragAt(this.board, pending.position);
    if (!drag) {
      this.clearPointerState();
      return;
    }

    const view = this.itemViews.get(pending.itemId);
    if (!view) {
      this.clearPointerState();
      return;
    }

    this.draggedItemId = pending.itemId;
    this.pendingDrag = undefined;
    this.children.bringToTop(view);
    this.children.bringToTop(this.hoverHighlight);
    this.children.bringToTop(this.resetButton);
    view.setAlpha(0.94);
    view.setScale(1.08);
    view.setPosition(pointer.worldX, pointer.worldY);
    this.setEvent(`Dragging ${this.getItemLabel(pending.itemId)}`);
    this.updateDebugText();
  }

  private finishDrag(resolution?: DropResolution, shouldReturn = false): void {
    const view = this.draggedItemId ? this.itemViews.get(this.draggedItemId) : undefined;
    const createdItemId = resolution?.mergeResult?.created.id;
    const buildingId = resolution?.mergeResult
      ? this.getVillageBuildingId(resolution.mergeResult.created.configId)
      : undefined;
    const shouldPlaceImmediately = resolution?.type === 'merge' && Boolean(resolution.mergeResult);
    this.hideHoverHighlight();

    let didAnimateReturn = false;
    if (view && shouldReturn) {
      const position = this.findItemPosition(this.draggedItemId ?? '');
      const target = position ? this.getCellCenter(position) : undefined;
      if (target) {
        didAnimateReturn = true;
        this.tweens.add({
          targets: view,
          x: target.x,
          y: target.y,
          scale: 1,
          alpha: 1,
          duration: 150,
          ease: 'Back.Out',
          onComplete: () => this.updateDebugText(),
        });
      } else {
        view.setAlpha(1);
        view.setScale(1);
      }
    } else {
      view?.setAlpha(1);
      view?.setScale(1);
    }

    this.draggedItemId = undefined;
    this.clearPointerState();
    if (!didAnimateReturn) {
      this.syncItemViews(!shouldPlaceImmediately);
    }

    if (createdItemId) {
      this.playMergeFeedback(createdItemId);
    }

    if (createdItemId && buildingId && resolution?.type === 'merge') {
      this.queueBuildingCompletion(createdItemId, buildingId, resolution.to);
    } else if (this.isAcceptedResolution(resolution)) {
      this.saveGame();
    }

    this.updateHud();
    this.updateDebugText();
  }

  private unloadCargo(): void {
    const targetPosition = this.findFirstEmptyCell();
    if (!targetPosition) {
      this.setStatus('Board full');
      this.setEvent('Clear space before opening more cargo.');
      return;
    }

    const configId = this.truck.unloadOne();
    if (!configId) {
      this.setStatus('Truck empty');
      this.setEvent('The truck is waiting for the next delivery.');
      this.updateHud();
      return;
    }

    const item = this.createItemAt(configId, targetPosition);
    this.syncItemViews(false);
    const view = this.itemViews.get(item.id);
    const target = this.getCellCenter(targetPosition);
    if (view) {
      view.setPosition(64, 158);
      view.setScale(0.75);
      this.children.bringToTop(view);
      this.tweens.add({
        targets: view,
        x: target.x,
        y: target.y,
        scale: 1,
        duration: 180,
        ease: 'Back.Out',
      });
    }

    this.setStatus('Cargo opened');
    this.setEvent(`${this.getConfigLabel(configId)} placed on the board.`);
    this.saveGame();
    this.updateHud();
    this.updateDebugText();
  }

  private createItemAt(configId: string, position: BoardPosition): ItemInstance {
    const item = this.itemStore.create(configId);
    const placed = this.board.placeItem(item.id, position);
    if (!placed) {
      this.itemStore.remove(item.id);
      throw new Error(`Failed to place item "${configId}" at ${position.x}:${position.y}.`);
    }
    return item;
  }

  private syncItemViews(animate = true): void {
    const activeIds = new Set(this.itemStore.all().map((item) => item.id));
    for (const [itemId, view] of this.itemViews) {
      if (!activeIds.has(itemId)) {
        view.destroy();
        this.itemViews.delete(itemId);
      }
    }

    for (const item of this.itemStore.all()) {
      let view = this.itemViews.get(item.id);
      if (!view) {
        view = this.createItemView(item);
        this.itemViews.set(item.id, view);
      }

      if (item.id !== this.draggedItemId && !this.finalizingItemIds.has(item.id)) {
        const position = this.findItemPosition(item.id);
        if (position) {
          const center = this.getCellCenter(position);
          this.tweens.killTweensOf(view);
          view.setAlpha(1);
          view.setScale(1);
          if (animate) {
            this.tweens.add({
              targets: view,
              x: center.x,
              y: center.y,
              duration: 120,
              ease: 'Quad.Out',
            });
          } else {
            view.setPosition(center.x, center.y);
          }
        }
      }
    }
  }

  private createItemView(item: ItemInstance): Phaser.GameObjects.Container {
    const config = this.itemRegistry.require(item.configId);
    const visual = this.getVisual(item.configId);
    const children: Phaser.GameObjects.GameObject[] = [
      this.add.ellipse(2, 6, 38, 16, 0x000000, 0.18),
    ];

    if (this.textures.exists(config.icon)) {
      children.push(this.add.image(0, -3, config.icon).setDisplaySize(36, 36));
    } else {
      children.push(this.add.circle(0, -2, 20, visual.color).setStrokeStyle(3, 0x35424a, 1));
    }

    children.push(
      this.add
        .text(0, 17, visual.label, {
          color: visual.textColor,
          fontFamily: 'Arial',
          fontSize: visual.label.length > 4 ? '8px' : '10px',
          fontStyle: 'bold',
        })
        .setOrigin(0.5),
    );

    const view = this.add.container(0, 0, children);
    view.setSize(44, 44);
    view.setInteractive(
      new Phaser.Geom.Rectangle(-22, -22, 44, 44),
      Phaser.Geom.Rectangle.Contains,
      true,
    );
    if (view.input) {
      view.input.cursor = 'grab';
    }
    view.on('pointerdown', (pointer: Phaser.Input.Pointer) => this.handleItemPointerDown(item.id, pointer));
    return view;
  }

  private queueBuildingCompletion(itemId: string, buildingId: string, position: BoardPosition): void {
    this.finalizingItemIds.add(itemId);
    this.time.delayedCall(260, () => this.flyItemToVillage(itemId, buildingId, position));
  }

  private flyItemToVillage(itemId: string, buildingId: string, position: BoardPosition): void {
    if (!this.itemStore.get(itemId)) {
      this.finalizingItemIds.delete(itemId);
      return;
    }

    const view = this.itemViews.get(itemId);
    const complete = (): void => {
      this.board.removeItem(position);
      this.itemStore.remove(itemId);
      this.finalizingItemIds.delete(itemId);
      view?.destroy();
      this.itemViews.delete(itemId);
      const built = this.village.build(buildingId);
      this.drawVillagePanel();
      this.syncItemViews(false);
      this.setStatus(built ? 'Coop built' : 'Coop already built');
      this.setEvent(
        built
          ? 'The chicken coop moved into the village. The empty lot is no longer empty.'
          : 'The village already has this building.',
      );
      this.saveGame();
      this.updateHud(true);
      this.updateDebugText();
    };

    if (!view) {
      complete();
      return;
    }

    this.children.bringToTop(view);
    const target = this.getVillageAnchor();
    this.tweens.add({
      targets: view,
      x: target.x,
      y: target.y,
      scale: 0.6,
      alpha: 0.2,
      duration: 420,
      ease: 'Cubic.InOut',
      onComplete: complete,
    });
  }

  private getDropPreview(position: BoardPosition): DropPreviewType {
    const drag = this.gestureController.getDragState();
    if (!drag || drag.itemId !== this.draggedItemId) {
      return 'reject';
    }

    if (drag.from.x === position.x && drag.from.y === position.y) {
      return 'noop';
    }

    const sourceCell = this.board.getCell(drag.from);
    const targetCell = this.board.getCell(position);
    if (!sourceCell || !targetCell || sourceCell.itemId !== drag.itemId) {
      return 'reject';
    }

    if (targetCell.itemId && this.finalizingItemIds.has(targetCell.itemId)) {
      return 'reject';
    }

    if (!targetCell.itemId) {
      return this.board.canMove(drag.from, position) ? 'move' : 'reject';
    }

    if (this.mergeFlow.canMergeCells(this.board, this.itemStore, drag.from, position)) {
      return 'merge';
    }

    return this.board.canSwap(drag.from, position) ? 'swap' : 'reject';
  }

  private showHoverHighlight(position: BoardPosition, preview: DropPreviewType): void {
    const style = DROP_PREVIEW_STYLES[preview];
    const topLeft = this.board.grid.toWorld(position);
    this.hoverHighlight.clear();
    this.hoverHighlight.fillStyle(style.fill, 0.25);
    this.hoverHighlight.fillRoundedRect(
      topLeft.x + CELL_INSET,
      topLeft.y + CELL_INSET,
      CELL_DRAW_SIZE,
      CELL_DRAW_SIZE,
      8,
    );
    this.hoverHighlight.lineStyle(3, style.stroke, 0.95);
    this.hoverHighlight.strokeRoundedRect(
      topLeft.x + CELL_INSET,
      topLeft.y + CELL_INSET,
      CELL_DRAW_SIZE,
      CELL_DRAW_SIZE,
      8,
    );
    this.hoverHighlight.setVisible(true);
  }

  private hideHoverHighlight(): void {
    this.hoverHighlight.clear();
    this.hoverHighlight.setVisible(false);
  }

  private playMergeFeedback(itemId: string): void {
    const view = this.itemViews.get(itemId);
    if (!view) {
      return;
    }

    this.children.bringToTop(view);
    this.tweens.add({
      targets: view,
      scale: { from: 1.28, to: 1 },
      duration: 190,
      ease: 'Back.Out',
    });

    const flash = this.add.circle(view.x, view.y, 10, 0xffffff, 0.72);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 3,
      duration: 230,
      ease: 'Quad.Out',
      onComplete: () => flash.destroy(),
    });
  }

  private findFirstEmptyCell(): BoardPosition | undefined {
    return this.board.getCells().find((cell) => !cell.itemId)?.position;
  }

  private findItemPosition(itemId: string): BoardPosition | undefined {
    return this.board.getCells().find((cell) => cell.itemId === itemId)?.position;
  }

  private getCellCenter(position: BoardPosition): { x: number; y: number } {
    const topLeft = this.board.grid.toWorld(position);
    return {
      x: topLeft.x + this.board.grid.cellSize / 2,
      y: topLeft.y + this.board.grid.cellSize / 2,
    };
  }

  private getVillageAnchor(): { x: number; y: number } {
    return { x: 256, y: 145 };
  }

  private describeResolution(resolution: DropResolution | undefined): string {
    if (!resolution) {
      return 'Returned';
    }
    if (resolution.type === 'merge') {
      const configId = resolution.mergeResult?.created.configId;
      return configId ? `Merged into ${this.getConfigLabel(configId)}` : 'Merged';
    }
    if (resolution.type === 'move') {
      return 'Moved';
    }
    if (resolution.type === 'swap') {
      return 'Swapped';
    }
    if (resolution.type === 'noop') {
      return 'No change';
    }
    return 'Returned';
  }

  private getItemLabel(itemId: string): string {
    const item = this.itemStore.get(itemId);
    return item ? this.getConfigLabel(item.configId) : '?';
  }

  private getConfigLabel(configId: string): string {
    return this.itemRegistry.get(configId)?.name ?? configId;
  }

  private getVisual(configId: string): ItemVisualConfig {
    return (
      GAME_CONTENT.visuals[configId] ?? {
        color: 0xc0cad2,
        label: '?',
        textColor: '#28313b',
      }
    );
  }

  private getVillageBuildingId(configId: string): string | undefined {
    const value = this.itemRegistry.get(configId)?.data?.villageBuildingId;
    return typeof value === 'string' ? value : undefined;
  }

  private isAcceptedResolution(resolution: DropResolution | undefined): boolean {
    return resolution?.type === 'move' || resolution?.type === 'swap' || resolution?.type === 'merge';
  }

  private isActivePointer(pointer: Phaser.Input.Pointer): boolean {
    return this.activePointerId === undefined || pointer.id === this.activePointerId;
  }

  private clearPointerState(): void {
    this.activePointerId = undefined;
    this.pendingDrag = undefined;
  }

  private saveGame(): void {
    const envelope = this.gameSaveManager.serialize({
      board: this.board.serialize(),
      items: this.itemStore.serialize(),
      truck: this.truck.serialize(),
      village: this.village.serialize(),
    });
    this.saveStore.save(envelope);
  }

  private resetDemo(): void {
    this.gestureController.cancelDrag('RESET');
    this.hideHoverHighlight();
    this.clearPointerState();
    this.draggedItemId = undefined;
    this.finalizingItemIds.clear();
    this.mergeLog.splice(0);
    this.itemViews.forEach((view) => view.destroy());
    this.itemViews.clear();
    this.saveStore.clear();
    this.createFreshState();
    this.drawBoard();
    this.drawVillagePanel();
    this.syncItemViews(false);
    this.saveGame();
    this.setStatus('Reset');
    this.setEvent('Truck, board, and village reset.');
    this.updateHud(true);
    this.updateDebugText();
  }

  private toggleDebug(): void {
    this.debugVisible = !this.debugVisible;
    this.debugText.setVisible(this.debugVisible);
    this.updateDebugText();
  }

  private updateHud(force = false): void {
    if (!this.truckText || !this.cargoButton) {
      return;
    }

    const cargoFull = this.truck.cargo >= this.truck.capacity;
    const next = cargoFull ? 'Full' : this.formatMs(this.truck.timeToNextMs());
    this.truckText.setText([`${this.truck.cargo}/${this.truck.capacity}`, `Next ${next}`].join('\n'));
    this.cargoButton.setAlpha(this.truck.cargo > 0 ? 1 : 0.55);
    if (force) {
      this.drawVillagePanel();
    }
  }

  private updateDebugText(): void {
    if (!this.debugText || !this.board) {
      return;
    }

    const occupied = this.board
      .getCells()
      .filter((cell) => cell.itemId)
      .map((cell) => {
        const itemId = cell.itemId ?? '';
        return `${cell.id}:${this.getItemLabel(itemId)}#${this.shortId(itemId)}`;
      })
      .join('  ');
    const rules = this.mergeManager
      .getRules()
      .map((rule) => `${rule.from.join('+')}=${rule.to}`)
      .join('  ');
    this.debugText.setText(
      [
        `items: ${this.itemStore.all().length} | cargo: ${this.truck.cargo}/${this.truck.capacity}`,
        `rules: ${rules || '-'}`,
        `cells: ${occupied || '-'}`,
        `merge log: ${this.mergeLog.join(' | ') || '-'}`,
      ].join('\n'),
    );
  }

  private formatMs(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private shortId(itemId: string): string {
    return itemId.length > 6 ? itemId.slice(-6) : itemId;
  }

  private setStatus(text: string): void {
    this.statusText.setText(text);
  }

  private setEvent(text: string): void {
    this.eventText.setText(text);
  }
}
