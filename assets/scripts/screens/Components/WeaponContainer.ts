import { _decorator, Component, Node, Graphics, UITransform, Color, Prefab } from 'cc';
import { UiConfig } from '../../config/Index';
import { WeaponCard } from './WeaponCard';
import { WeaponType } from '../../constants/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponContainer')
export class WeaponContainer extends Component {

    @property({ type: Prefab, displayName: '基础武器预制体' })
    public basicWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '快速武器预制体' })
    public rapidWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '重型武器预制体' })
    public heavyWeaponPrefab: Prefab = null;

    @property({ type: Prefab, displayName: '狙击武器预制体' })
    public sniperWeaponPrefab: Prefab = null;
    
    onLoad() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 4个格子宽 x 2个格子高
        const width = UiConfig.CELL_SIZE * 4;
        const height = UiConfig.CELL_SIZE * 2;
        transform.setAnchorPoint(0, 0);
        transform.setContentSize(width, height);
        
        // 绘制蓝色背景
        graphics.fillColor = Color.BLUE;
        graphics.rect(0, 0, width, height);
        graphics.fill();
    }

    start() {
        // 定义4种武器类型和对应的预制体
        const weaponConfigs: Array<{ type: WeaponType; prefab: Prefab | null }> = [
            { type: WeaponType.BASIC, prefab: this.basicWeaponPrefab },
            { type: WeaponType.RAPID, prefab: this.rapidWeaponPrefab },
            { type: WeaponType.HEAVY, prefab: this.heavyWeaponPrefab },
            { type: WeaponType.SNIPER, prefab: this.sniperWeaponPrefab }
        ];
        
        const cellSize = UiConfig.CELL_SIZE;
        
        // 为每种武器类型动态创建一个武器卡片节点
        weaponConfigs.forEach((config, index) => {
            // 创建新节点
            const weaponCardNode = new Node(`WeaponCard_${config.type}`);
            
            // 添加 UITransform 组件
            const transform = weaponCardNode.addComponent(UITransform);
            transform.setAnchorPoint(0, 0);
            transform.setContentSize(cellSize, cellSize);
            
            // 添加 Graphics 组件
            weaponCardNode.addComponent(Graphics);
            
            // 添加 WeaponCard 组件
            const weaponCardComponent = weaponCardNode.addComponent(WeaponCard);
            
            weaponCardComponent.weaponType = config.type;
            weaponCardComponent.weaponPrefab = config.prefab;
            
            // 设置父节点和位置
            weaponCardNode.setParent(this.node);
            const x = index * cellSize;
            const y = 0; // 底部对齐
            weaponCardNode.setPosition(x, y, 0);
        });
    }

    update(deltaTime: number) {
        
    }
}

