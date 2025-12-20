import { _decorator, Component, Node, Graphics, UITransform, Color, Prefab, instantiate } from 'cc';
import { UiConfig } from '../../config/Index';
const { ccclass, property } = _decorator;

@ccclass('WeaponContainer')
export class WeaponContainer extends Component {

    @property(Prefab)
    public weaponCardPrefab: Prefab = null;
    
    onLoad() {
        const graphics = this.node.getComponent(Graphics);
        const transform = this.node.getComponent(UITransform);
        
        // 设置大小为 4个格子宽 x 2个格子高
        const width = UiConfig.CELL_SIZE * 4;
        const height = UiConfig.CELL_SIZE * 2;
        transform.setContentSize(width, height);
        
        // 绘制蓝色背景
        graphics.fillColor = Color.BLUE;
        graphics.rect(-width / 2, -height / 2, width, height);
        graphics.fill();
    }

    start() {
        // 在容器中间展示 weaponCardPrefab
        if (this.weaponCardPrefab) {
            const weaponCardNode = instantiate(this.weaponCardPrefab);
            weaponCardNode.setParent(this.node);
            // 设置位置在容器中间（原点位置）
            weaponCardNode.setPosition(0, 0, 0);
        }
    }

    update(deltaTime: number) {
        
    }
}

