import { Graphics, Color, Node, Vec3, UITransform } from 'cc';
import { UiColors } from '../constants/Index';
import { EnemyManager, WeaponManager } from '../managers/Index';
import { WeaponBase } from '../weapons/Index';
import { getWeaponColor } from '../constants/Index';

/**
 * 小地图渲染器
 * 负责小地图的绘制逻辑
 * 参考原游戏实现
 */
export class MiniMapRenderer {
    // 小地图标记尺寸
    private static readonly ENEMY_SIZE = 2; // 敌人圆点半径
    private static readonly WEAPON_SIZE = 3; // 武器方块边长的一半

    /**
     * 绘制小地图背景
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     * @param warViewTransform WarView 的 UITransform（用于绘制网格）
     */
    static renderBackground(graphics: Graphics, width: number, height: number, warViewTransform?: UITransform): void {
        if (!graphics) return;

        // 绘制渐变背景（从深蓝紫色到更深的蓝紫色）
        const gradientSteps = UiColors.MINIMAP_GRADIENT_STEPS;
        const stepHeight = height / gradientSteps;

        for (let i = 0; i < gradientSteps; i++) {
            const ratio = i / (gradientSteps - 1);
            
            // 使用常量创建渐变颜色
            const color = UiColors.createGradientColor(
                UiColors.MINIMAP_BG_START,
                UiColors.MINIMAP_BG_END,
                ratio
            );
            
            const y = stepHeight * i;
            
            graphics.fillColor = color;
            graphics.rect(0, y, width, stepHeight + 1);
            graphics.fill();
        }

        // 网格绘制已移除

        // 绘制外边框（发光效果，青色）
        graphics.strokeColor = UiColors.MINIMAP_BORDER_COLOR;
        graphics.lineWidth = UiColors.MINIMAP_BORDER_WIDTH;
        graphics.rect(0, 0, width, height);
        graphics.stroke();

        // 绘制内边框（高光，白色半透明）
        graphics.strokeColor = UiColors.MINIMAP_INNER_BORDER_COLOR;
        graphics.lineWidth = UiColors.MINIMAP_INNER_BORDER_WIDTH;
        graphics.rect(1, 1, width - 2, height - 2);
        graphics.stroke();
    }

    /**
     * 绘制敌人位置
     * @param graphics Graphics 组件
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewNode WarView 节点
     * @param enemyManager 敌人管理器
     */
    static renderEnemies(
        graphics: Graphics,
        minimapWidth: number,
        minimapHeight: number,
        warViewNode: Node,
        enemyManager: EnemyManager | null
    ): void {
        if (!graphics || !warViewNode || !enemyManager) return;

        const enemies = enemyManager.getAllEnemies();
        if (enemies.length === 0) return;

        const warViewTransform = warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;

        // 计算缩放比例和偏移量
        const scale = this.calculateScale(minimapWidth, minimapHeight, warViewTransform);
        const offset = this.calculateOffset(minimapWidth, minimapHeight, warViewTransform, scale);

        // 绘制敌人位置（红色圆点，参考原游戏）
        graphics.fillColor = new Color(255, 0, 0, 230); // 红色，90%透明度
        for (const enemy of enemies) {
            if (!enemy || !enemy.isValid) continue;

            const enemyPos = enemy.position;
            const minimapX = offset.x + enemyPos.x * scale.scaleX;
            const minimapY = offset.y + enemyPos.y * scale.scaleY;

            // 绘制小圆点
            graphics.circle(minimapX, minimapY, this.ENEMY_SIZE);
            graphics.fill();
        }
    }

    /**
     * 绘制武器位置
     * @param graphics Graphics 组件
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewNode WarView 节点
     * @param weaponManager 武器管理器
     */
    static renderWeapons(
        graphics: Graphics,
        minimapWidth: number,
        minimapHeight: number,
        warViewNode: Node,
        weaponManager: WeaponManager | null
    ): void {
        if (!graphics || !warViewNode || !weaponManager) return;

        const weapons = weaponManager.getAllWeapons();
        if (weapons.length === 0) return;

        const warViewTransform = warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;

        // 计算缩放比例和偏移量
        const scale = this.calculateScale(minimapWidth, minimapHeight, warViewTransform);
        const offset = this.calculateOffset(minimapWidth, minimapHeight, warViewTransform, scale);
        
        // 绘制武器位置（根据武器类型显示不同颜色，参考原游戏）
        for (const weapon of weapons) {
            if (!weapon || !weapon.isValid) continue;

            const weaponComponent = weapon.getComponent(WeaponBase);
            if (!weaponComponent) continue;

            // 根据武器类型获取颜色
            const weaponType = weaponComponent.getWeaponType();
            const weaponColor = getWeaponColor(weaponType);
            
            // 创建半透明颜色（90%透明度）
            const color = new Color(weaponColor.r, weaponColor.g, weaponColor.b, 230);

            const weaponPos = weapon.position;
            const minimapX = offset.x + weaponPos.x * scale.scaleX;
            const minimapY = offset.y + weaponPos.y * scale.scaleY;

            // 绘制小方块（参考原游戏）
            graphics.fillColor = color;
            graphics.rect(
                minimapX - this.WEAPON_SIZE,
                minimapY - this.WEAPON_SIZE,
                this.WEAPON_SIZE * 2,
                this.WEAPON_SIZE * 2
            );
            graphics.fill();
        }
    }

    /**
     * 计算缩放比例（X和Y分别计算，充满整个小地图）
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewTransform WarView 的 UITransform
     * @returns 缩放比例对象 {scaleX, scaleY}
     */
    private static calculateScale(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform): { scaleX: number; scaleY: number } {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;

        // 分别计算X和Y的缩放比例，让内容充满整个小地图
        const scaleX = minimapWidth / warViewWidth;
        const scaleY = minimapHeight / warViewHeight;

        return { scaleX, scaleY };
    }

    /**
     * 计算偏移量（充满整个小地图，不需要偏移）
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewTransform WarView 的 UITransform
     * @param scale 缩放比例对象
     * @returns 偏移量（充满时偏移为0）
     */
    private static calculateOffset(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform, scale: { scaleX: number; scaleY: number }): Vec3 {
        // 充满整个小地图，不需要偏移
        return new Vec3(0, 0, 0);
    }
}

