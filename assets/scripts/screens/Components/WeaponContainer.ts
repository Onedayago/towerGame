import { _decorator, Component, Node, Graphics, UITransform, Color, Prefab } from 'cc';
import { UiConfig } from '../../config/Index';
import { WeaponCard } from './WeaponCard';
import { WeaponType } from '../../constants/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponContainer')
export class WeaponContainer extends Component {

    @property({ type: Prefab, displayName: '基础武器预制体' })
    public basicWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '激光武器预制体' })
    public laserWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '火箭塔预制体' })
    public rocketWeaponPrefab: Prefab = null;
    
    onLoad() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 3个格子宽 x 2个格子高（3种武器）
        const width = UiConfig.CELL_SIZE * 3;
        const height = UiConfig.CELL_SIZE * 2;
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(width, height);
        
        // 绘制蓝色背景
        graphics.fillColor = Color.BLUE;
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    start() {
        this.createWeaponCards();
    }

    /**
     * 创建武器卡片
     * 为每种武器类型创建一个武器卡片节点
     */
    private createWeaponCards() {
        // 定义3种武器类型和对应的预制体
        const weaponConfigs: Array<{ type: WeaponType; prefab: Prefab | null }> = [
            { type: WeaponType.BASIC, prefab: this.basicWeaponPrefab },
            { type: WeaponType.LASER, prefab: this.laserWeaponPrefab },
            { type: WeaponType.ROCKET, prefab: this.rocketWeaponPrefab }
        ];
        
        const cellSize = UiConfig.CELL_SIZE;
        
        // 为每种武器类型动态创建一个武器卡片节点
        weaponConfigs.forEach((config, index) => {
            const weaponCardNode = this.createWeaponCardNode(config.type, config.prefab, cellSize);
            
            // 设置位置：水平排列，每个卡片占一个格子
            // 卡片锚点在左下角 (0, 0)，所以位置从 0 开始
            const x = index * cellSize;
            const y = 0; // 底部对齐
            weaponCardNode.setPosition(x, y, 0);
        });
    }

    /**
     * 创建单个武器卡片节点
     * @param weaponType 武器类型
     * @param weaponPrefab 武器预制体
     * @param cellSize 格子大小
     * @returns 创建的武器卡片节点
     */
    private createWeaponCardNode(weaponType: WeaponType, weaponPrefab: Prefab | null, cellSize: number): Node {
        // 创建新节点
        const weaponCardNode = new Node(`WeaponCard_${weaponType}`);
        
        // 添加 UITransform 组件
        const transform = weaponCardNode.addComponent(UITransform);
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(cellSize, cellSize);
        
        // 添加 Graphics 组件（用于绘制）
        weaponCardNode.addComponent(Graphics);
        
        // 添加 WeaponCard 组件并设置属性
        const weaponCardComponent = weaponCardNode.addComponent(WeaponCard);
        weaponCardComponent.weaponType = weaponType;
        weaponCardComponent.weaponPrefab = weaponPrefab;
        
        // 设置父节点
        weaponCardNode.setParent(this.node);
        
        return weaponCardNode;
    }

    update(deltaTime: number) {
        // 更新逻辑可以在这里添加
    }
}

