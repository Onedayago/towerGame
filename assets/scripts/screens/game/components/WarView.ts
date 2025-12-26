import { _decorator, Component, Graphics, Node, UITransform, EventTouch, Prefab, Vec3, AudioClip } from 'cc';
import { UiConfig } from '../../../config/Index';
import { EnemyManager, WeaponManager, BulletManager, ObstacleManager, BaseManager, WaveManager } from '../../../managers/Index';
import { MapDragHandler } from '../../../business/Index';
import { WarGridRenderer, BaseRenderer } from '../../../renderers/Index';
import { PathFinder } from '../../../utils/Index';
import { WarViewManagers } from './WarViewManagers';
import { WarViewObstacles } from './WarViewObstacles';
import { GameOverView } from './GameOverView';
const { ccclass, property } = _decorator;

@ccclass('WarView')
export class WarView extends Component {

    private graphics: Graphics | null = null;
    private enemyManager: EnemyManager | null = null;
    private weaponManager: WeaponManager | null = null;
    private bulletManager: BulletManager | null = null;
    private obstacleManager: ObstacleManager | null = null;
    private dragHandler: MapDragHandler | null = null;
    private gameManager: any;
    private managersHelper: WarViewManagers | null = null;
    private obstaclesHelper: WarViewObstacles | null = null;
    private hasStartedFirstWave: boolean = false;
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Node, displayName: '基地节点' })
    private baseNode: Node | null = null;

    @property(Prefab)
    public enemyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyFastTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyHeavyTankPrefab: Prefab = null;

    @property(Prefab)
    public enemyBossPrefab: Prefab = null;
    
    @property({ type: Prefab, displayName: '敌人生成特效预制体', tooltip: '敌人生成时的特效预制体' })
    public enemySpawnEffectPrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '岩石障碍物预制体', tooltip: '岩石障碍物预制体' })
    public rockObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '墙壁障碍物预制体', tooltip: '墙壁障碍物预制体' })
    public wallObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '树木障碍物预制体', tooltip: '树木障碍物预制体' })
    public treeObstaclePrefab: Prefab | null = null;
    
    @property({ type: Prefab, displayName: '箱子障碍物预制体', tooltip: '箱子障碍物预制体' })
    public boxObstaclePrefab: Prefab | null = null;
    
    @property({ type: AudioClip, displayName: '背景音乐', tooltip: '游戏背景音乐音频剪辑' })
    public backgroundMusicClip: AudioClip | null = null;
    
    @property({ type: AudioClip, displayName: '爆炸音效', tooltip: '敌人爆炸音效音频剪辑' })
    public boomSoundClip: AudioClip | null = null;

    @property({ type: GameOverView, displayName: '游戏结束界面', tooltip: '游戏结束界面组件' })
    private gameOverView: GameOverView | null = null;

    onLoad() {
        this.initTransform();
        this.initManagers();
        this.initEventListeners();
        this.drawGrid();
        this.initBase();
        
    }
    

    /**
     * 绘制战场格子
     */
    private drawGrid() {
        if (!this.graphics) return;
        
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const width = transform.width;
        const height = transform.height;
        
        // 绘制格子
        WarGridRenderer.renderGrid(this.graphics, width, height);
    }
    
    /**
     * 初始化我方基地
     * 在基地节点创建基地，位置在战场右边中间
     */
    private initBase() {
        // 如果未绑定基地节点，则跳过初始化
        if (!this.baseNode) {
            console.warn('WarView: 基地节点未绑定，请通过编辑器绑定');
            return;
        }
        
        // 获取战场尺寸
        const transform = this.node.getComponent(UITransform);
        if (!transform) return;
        
        const battlefieldWidth = transform.width;
        const battlefieldHeight = transform.height;
        const cellSize = UiConfig.CELL_SIZE;
        
        // 基地尺寸：2x2 格子
        const baseWidth = cellSize * 2;
        const baseHeight = cellSize * 2;
        
        // 设置基地节点的变换
        let baseTransform = this.baseNode.getComponent(UITransform);
        if (!baseTransform) {
            baseTransform = this.baseNode.addComponent(UITransform);
        }
        
        baseTransform.setAnchorPoint(0, 0);
        baseTransform.setContentSize(baseWidth, baseHeight);
        
        // 计算位置（对齐到网格）
        let baseX: number;
        let baseY: number;
        
        // 检查最右边是否不足一列
        const fullColumns = Math.floor(battlefieldWidth / cellSize);
        const remainingWidth = battlefieldWidth - fullColumns * cellSize;
        const hasIncompleteColumn = remainingWidth > 0 && remainingWidth < cellSize;
        
        if (hasIncompleteColumn) {
            // 如果最右边不足一列，基地移动到倒数第二列和倒数第三列（从右往左数）
            // 基地宽度是2个格子，所以放在倒数第二列和倒数第三列
            // 对齐到网格：倒数第三列的起始位置（从0开始计数）
            const targetColumn = fullColumns - 3; // 倒数第三列（基地占据倒数第三列和倒数第二列）
            baseX = targetColumn * cellSize; // 对齐到网格左下角
        } else {
            // 否则放在右边（倒数第一列和第二列）
            // 对齐到网格：倒数第二列的起始位置（从0开始计数）
            const targetColumn = fullColumns - 2; // 倒数第二列（基地占据倒数第二列和倒数第一列）
            baseX = targetColumn * cellSize; // 对齐到网格左下角
        }
        
        // Y 位置：对齐到网格，垂直居中
        const fullRows = Math.floor(battlefieldHeight / cellSize);
        const targetRow = Math.floor((fullRows - 2) / 2); // 垂直居中，考虑基地高度是2个格子
        baseY = targetRow * cellSize; // 对齐到网格左下角
        this.baseNode.setPosition(baseX, baseY, 0);
        
        // 添加 Graphics 组件并绘制基地
        let baseGraphics = this.baseNode.getComponent(Graphics);
        if (!baseGraphics) {
            baseGraphics = this.baseNode.addComponent(Graphics);
        }
        
        // 绘制基地
        BaseRenderer.render(baseGraphics, baseWidth, baseHeight);
        
        // 初始化基地管理器
        const baseManager = BaseManager.getInstance();
        baseManager.init(this.baseNode, 1000); // 基地初始生命值1000
        baseManager.reset(); // 重置基地生命值
        baseManager.setOnDestroyedCallback(() => {
            this.onBaseDestroyed();
        });
        
        // 初始化基地血条显示
        baseManager.updateHealthBar();
        
        // 基地创建后，生成障碍物（排除基地周围3个格子范围）
        this.generateRandomObstacles(undefined, 0.08);
    }

    /**
     * 基地被摧毁时的处理
     */
    private onBaseDestroyed() {
        // 停止游戏
        if (this.gameManager) {
            this.gameManager.stopGame();
        }
        
        // 获取当前波次
        const waveManager = WaveManager.getInstance();
        const finalWave = waveManager.getWaveLevel();
        
        // 显示游戏结束界面
        if (this.gameOverView) {
            this.gameOverView.show(finalWave);
        }
    }
    
    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        this.graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        const width = UiConfig.GAME_WIDTH * 2;
        const height = UiConfig.CELL_SIZE * 12;
        transform.setContentSize(width, height);
        transform.setAnchorPoint(0, 0);
        this.node.setPosition(0, 0, 0);
    }

    /**
     * 初始化管理器
     */
    private initManagers() {
        this.managersHelper = new WarViewManagers(
            this.node,
            this.baseNode,
            this.enemySpawnEffectPrefab,
            this.enemyTankPrefab,
            this.enemyFastTankPrefab,
            this.enemyHeavyTankPrefab,
            this.enemyBossPrefab,
            this.rockObstaclePrefab,
            this.wallObstaclePrefab,
            this.treeObstaclePrefab,
            this.boxObstaclePrefab,
            this.backgroundMusicClip,
            this.boomSoundClip
        );
        
        const managers = this.managersHelper.initManagers();
        this.gameManager = managers.gameManager;
        this.dragHandler = managers.dragHandler;
        this.enemyManager = managers.enemyManager;
        this.weaponManager = managers.weaponManager;
        this.bulletManager = managers.bulletManager;
        this.obstacleManager = managers.obstacleManager;
        
        // 初始化障碍物生成助手
        this.obstaclesHelper = new WarViewObstacles(this.node, this.baseNode, this.obstacleManager);
    }
    
    /**
     * 随机生成障碍物
     * @param count 生成数量（可选，如果不指定则根据密度计算）
     * @param density 生成密度（0-1，表示占用格子的比例，默认 0.15 即 15%）
     */
    private generateRandomObstacles(count?: number, density: number = 0.15) {
        if (this.obstaclesHelper) {
            this.obstaclesHelper.generateRandomObstacles(count, density);
        }
    }

    /**
     * 初始化事件监听器
     */
    private initEventListeners() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    /**
     * 触摸开始事件处理（地图拖拽）
     */
    onTouchStart(event: EventTouch) {
        this.dragHandler?.onTouchStart(event);
    }

    /**
     * 触摸移动事件处理（地图拖拽）
     */
    onTouchMove(event: EventTouch) {
        this.dragHandler?.onTouchMove(event);
    }

    /**
     * 触摸结束事件处理（地图拖拽和武器选中）
     */
    onTouchEnd(event: EventTouch) {
        // 先处理地图拖拽
        this.dragHandler?.onTouchEnd(event);
        
        // 如果拖拽处理器没有消耗事件，检查是否点击了武器
        if (!event.propagationStopped && this.weaponManager) {
            // 获取触摸位置（转换为本地坐标）
            const touchLocation = event.getUILocation();
            const localPos = new Vec3();
            const transform = this.node.getComponent(UITransform);
            if (transform) {
                transform.convertToNodeSpaceAR(new Vec3(touchLocation.x, touchLocation.y, 0), localPos);
                
                // 尝试获取点击位置的武器
                const weapon = this.weaponManager.getWeaponAtLocalPosition({ x: localPos.x, y: localPos.y });
                if (weapon) {
                    // 选中武器
                    this.weaponManager.selectWeapon(weapon);
                    event.propagationStopped = true;
                } else {
                    // 点击空白处，取消选中
                    this.weaponManager.deselectWeapon();
                }
            }
        }
    }

    onDestroy() {
        // 检查节点有效性，避免场景切换时的销毁错误
        if (this.node && this.node.isValid) {
            this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        
        if (this.dragHandler) {
            this.dragHandler.destroy();
            this.dragHandler = null;
        }
        
        if (this.enemyManager) {
            this.enemyManager.clearAll();
        }
        
        if (this.weaponManager) {
            this.weaponManager.clearAll();
        }
        
        if (this.bulletManager) {
            this.bulletManager.clearAll();
        }
        
        if (this.obstacleManager) {
            this.obstacleManager.clearAll();
        }
    }

    start() {
        // 场景加载后，游戏不自动开始，等待引导完成或跳过
        // 游戏开始由引导系统控制
        if (this.gameManager) {
            this.gameManager.stopGame(); // 确保游戏未开始
        }
        
        // 设置基地位置给敌人管理器（用于寻路）
        // 注意：PathFinder已经在initManagers中通过initPathfinder初始化
        if (this.enemyManager && this.baseNode) {
            const baseCenter = this.getBaseCenterPosition();
            if (baseCenter) {
                // 获取EnemyManager内部的PathFinder实例（通过initPathfinder返回）
                // 传入 weaponManager，使武器也成为障碍物
                const pathFinder = this.enemyManager.initPathfinder(this.obstacleManager, this.weaponManager);
                this.enemyManager.setPathfinding(pathFinder, baseCenter);
            }
        }
        // this.gameOverView.show(1);
    }

    update(deltaTime: number) {
        // 只有游戏开始后才更新管理器
        if (!this.gameManager || !this.gameManager.canUpdate()) return;

        // 游戏刚开始时，开始第一波
        if (!this.hasStartedFirstWave && this.enemyManager) {
            this.enemyManager.startFirstWave();
            this.hasStartedFirstWave = true;
        }

        // 更新敌人管理器
        if (this.enemyManager) {
            this.enemyManager.update(deltaTime);
        }
        
        // 更新武器管理器
        if (this.weaponManager) {
            this.weaponManager.update(deltaTime);
        }
        
        // 更新子弹管理器
        if (this.bulletManager) {
            this.bulletManager.update(deltaTime);
        }
    }
    
    /**
     * 获取武器管理器
     * @returns 武器管理器实例，如果未初始化则返回 null
     */
    getWeaponManager(): WeaponManager | null {
        return this.weaponManager;
    }

    /**
     * 获取敌人管理器
     * @returns 敌人管理器实例，如果未初始化则返回 null
     */
    getEnemyManager(): EnemyManager | null {
        return this.enemyManager;
    }
    
    /**
     * 获取障碍物管理器
     * @returns 障碍物管理器实例，如果未初始化则返回 null
     */
    getObstacleManager(): ObstacleManager | null {
        return this.obstacleManager;
    }
    
    /**
     * 获取基地节点（供外部调用）
     * @returns 基地节点，如果未绑定则返回 null
     */
    getBaseNode(): Node | null {
        return this.baseNode;
    }
    
    /**
     * 获取基地中心位置（供外部调用）
     * @returns 基地中心位置，如果未绑定则返回 null
     */
    getBaseCenterPosition(): Vec3 | null {
        if (!this.baseNode) {
            return null;
        }
        const basePos = this.baseNode.position;
        const baseTransform = this.baseNode.getComponent(UITransform);
        if (!baseTransform) {
            return new Vec3(basePos.x, basePos.y, 0);
        }
        // 基地锚点在左下角 (0, 0)，所以中心点是 position + size / 2
        return new Vec3(
            basePos.x + baseTransform.width / 2,
            basePos.y + baseTransform.height / 2,
            0
        );
    }

}

