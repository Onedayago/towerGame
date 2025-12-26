import { Node, Prefab, AudioClip } from 'cc';
import { GOLD_CONFIG } from '../../../config/Index';
import { EnemyManager, GameManager, WeaponManager, BulletManager, GoldManager, ObstacleManager, AudioManager } from '../../../managers/Index';
import { MapDragHandler } from '../../../business/Index';
import { EnemyType, ObstacleType } from '../../../constants/Index';

/**
 * WarView 管理器初始化助手
 * 负责初始化所有游戏管理器
 */
export class WarViewManagers {
    private warViewNode: Node;
    private baseNode: Node | null;
    private enemySpawnEffectPrefab: Prefab | null;
    private enemyTankPrefab: Prefab | null;
    private enemyFastTankPrefab: Prefab | null;
    private enemyHeavyTankPrefab: Prefab | null;
    private enemyBossPrefab: Prefab | null;
    private rockObstaclePrefab: Prefab | null;
    private wallObstaclePrefab: Prefab | null;
    private treeObstaclePrefab: Prefab | null;
    private boxObstaclePrefab: Prefab | null;
    private backgroundMusicClip: AudioClip | null;
    private boomSoundClip: AudioClip | null;

    constructor(
        warViewNode: Node,
        baseNode: Node | null,
        enemySpawnEffectPrefab: Prefab | null,
        enemyTankPrefab: Prefab | null,
        enemyFastTankPrefab: Prefab | null,
        enemyHeavyTankPrefab: Prefab | null,
        enemyBossPrefab: Prefab | null,
        rockObstaclePrefab: Prefab | null,
        wallObstaclePrefab: Prefab | null,
        treeObstaclePrefab: Prefab | null,
        boxObstaclePrefab: Prefab | null,
        backgroundMusicClip: AudioClip | null,
        boomSoundClip: AudioClip | null
    ) {
        this.warViewNode = warViewNode;
        this.baseNode = baseNode;
        this.enemySpawnEffectPrefab = enemySpawnEffectPrefab;
        this.enemyTankPrefab = enemyTankPrefab;
        this.enemyFastTankPrefab = enemyFastTankPrefab;
        this.enemyHeavyTankPrefab = enemyHeavyTankPrefab;
        this.enemyBossPrefab = enemyBossPrefab;
        this.rockObstaclePrefab = rockObstaclePrefab;
        this.wallObstaclePrefab = wallObstaclePrefab;
        this.treeObstaclePrefab = treeObstaclePrefab;
        this.boxObstaclePrefab = boxObstaclePrefab;
        this.backgroundMusicClip = backgroundMusicClip;
        this.boomSoundClip = boomSoundClip;
    }

    /**
     * 初始化所有管理器
     */
    initManagers(): {
        gameManager: GameManager;
        dragHandler: MapDragHandler;
        enemyManager: EnemyManager;
        weaponManager: WeaponManager;
        bulletManager: BulletManager;
        obstacleManager: ObstacleManager;
    } {
        const gameManager = GameManager.getInstance();
        
        // 初始化金币管理器
        const goldManager = GoldManager.getInstance();
        goldManager.init(GOLD_CONFIG.INITIAL_GOLD);
        
        // 初始化地图拖拽处理器
        const parent = this.warViewNode.parent;
        const dragHandler = new MapDragHandler(this.warViewNode, parent);

        // 初始化敌人管理器
        const enemyPrefabs = this.buildEnemyPrefabMap();
        const enemyManager = new EnemyManager(this.warViewNode, enemyPrefabs);
        
        // 设置敌人生成特效预制体
        if (this.enemySpawnEffectPrefab) {
            enemyManager.setSpawnEffectPrefab(this.enemySpawnEffectPrefab);
        }
        
        // 初始化武器管理器
        const weaponManager = new WeaponManager(this.warViewNode);
        
        // 初始化子弹管理器
        const bulletManager = new BulletManager(this.warViewNode);
        
        // 初始化障碍物管理器
        const obstaclePrefabs = this.buildObstaclePrefabMap();
        const obstacleManager = new ObstacleManager(this.warViewNode, obstaclePrefabs);
        
        // 设置管理器的依赖
        weaponManager.setBulletManager(bulletManager);
        weaponManager.setEnemyManager(enemyManager);
        bulletManager.setEnemyManager(enemyManager);
        bulletManager.setWeaponManager(weaponManager);
        enemyManager.setManagers(bulletManager, weaponManager);
        
        // 初始化寻路器（在start中设置基地位置）
        enemyManager.initPathfinder(obstacleManager);
        
        // 初始化音频管理器
        this.initAudioManager();
        
        return {
            gameManager,
            dragHandler,
            enemyManager,
            weaponManager,
            bulletManager,
            obstacleManager
        };
    }
    
    /**
     * 初始化音频管理器
     */
    private initAudioManager() {
        const audioManager = AudioManager.getInstance();
        
        // 清理无效的音频源引用（场景切换后可能存在的无效引用）
        audioManager.cleanupInvalidSources();
        
        // 设置音频管理器节点（使用当前 WarView 节点）
        audioManager.setAudioNode(this.warViewNode);
        
        // 设置音频资源
        if (this.backgroundMusicClip) {
            audioManager.setBackgroundMusic(this.backgroundMusicClip);
        }
        if (this.boomSoundClip) {
            audioManager.setBoomSound(this.boomSoundClip);
        }
        
        // 初始化并播放背景音乐
        audioManager.initBackgroundMusic();
        audioManager.playBackgroundMusic();
    }
    
    /**
     * 构建敌人预制体映射表
     * @returns 敌人类型到预制体的映射
     */
    private buildEnemyPrefabMap(): Map<EnemyType, Prefab> {
        const enemyPrefabs = new Map<EnemyType, Prefab>();
        
        if (this.enemyTankPrefab) {
            enemyPrefabs.set(EnemyType.TANK, this.enemyTankPrefab);
        }
        if (this.enemyFastTankPrefab) {
            enemyPrefabs.set(EnemyType.FAST_TANK, this.enemyFastTankPrefab);
        }
        if (this.enemyHeavyTankPrefab) {
            enemyPrefabs.set(EnemyType.HEAVY_TANK, this.enemyHeavyTankPrefab);
        }
        if (this.enemyBossPrefab) {
            enemyPrefabs.set(EnemyType.BOSS, this.enemyBossPrefab);
        }
        
        return enemyPrefabs;
    }
    
    /**
     * 构建障碍物预制体映射表
     * @returns 障碍物类型到预制体的映射
     */
    private buildObstaclePrefabMap(): Map<ObstacleType, Prefab> {
        const obstaclePrefabs = new Map<ObstacleType, Prefab>();
        
        if (this.rockObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.ROCK, this.rockObstaclePrefab);
        }
        if (this.wallObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.WALL, this.wallObstaclePrefab);
        }
        if (this.treeObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.TREE, this.treeObstaclePrefab);
        }
        if (this.boxObstaclePrefab) {
            obstaclePrefabs.set(ObstacleType.BOX, this.boxObstaclePrefab);
        }
        
        return obstaclePrefabs;
    }
}

