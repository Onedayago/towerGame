import { Graphics, Color, Node, Vec3, UITransform } from 'cc';
import { UiColors } from '../constants/Index';
import { EnemyManager, WeaponManager } from '../managers/Index';
import { DrawHelper } from '../utils/Index';

/**
 * 小地图渲染器
 * 负责小地图的绘制逻辑
 */
export class MiniMapRenderer {
    /**
     * 绘制小地图背景
     * @param graphics Graphics 组件
     * @param width 宽度
     * @param height 高度
     */
    static renderBackground(graphics: Graphics, width: number, height: number): void {
        if (!graphics) return;

        graphics.clear();

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

        // 绘制敌人位置（红色点）
        for (const enemy of enemies) {
            if (!enemy || !enemy.isValid) continue;

            const enemyPos = enemy.position;
            const minimapX = offset.x + enemyPos.x * scale;
            const minimapY = offset.y + enemyPos.y * scale;

            // 绘制小圆点
            DrawHelper.drawDot(graphics, minimapX, minimapY, 2, Color.RED);
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
        
        // 绘制武器位置（蓝色点）
        for (const weapon of weapons) {
            if (!weapon || !weapon.isValid) continue;

            const weaponPos = weapon.position;
            const minimapX = offset.x + weaponPos.x * scale;
            const minimapY = offset.y + weaponPos.y * scale;

            // 绘制小方块
            DrawHelper.drawSquare(graphics, minimapX, minimapY, 3, Color.BLUE);
        }
    }

    /**
     * 计算缩放比例
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewTransform WarView 的 UITransform
     * @returns 缩放比例
     */
    private static calculateScale(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform): number {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;

        // 计算宽高比
        const minimapAspect = minimapWidth / minimapHeight;
        const warViewAspect = warViewWidth / warViewHeight;

        // 根据宽高比选择合适的缩放方式
        let scale: number;
        if (minimapAspect > warViewAspect) {
            // 小地图更宽，以高度为准
            scale = minimapHeight / warViewHeight;
        } else {
            // 小地图更高，以宽度为准
            scale = minimapWidth / warViewWidth;
        }

        return scale;
    }

    /**
     * 计算偏移量
     * @param minimapWidth 小地图宽度
     * @param minimapHeight 小地图高度
     * @param warViewTransform WarView 的 UITransform
     * @param scale 缩放比例
     * @returns 偏移量
     */
    private static calculateOffset(minimapWidth: number, minimapHeight: number, warViewTransform: UITransform, scale: number): Vec3 {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;

        const scaledWidth = warViewWidth * scale;
        const scaledHeight = warViewHeight * scale;
        
        // 居中显示
        const offsetX = (minimapWidth - scaledWidth) / 2;
        const offsetY = (minimapHeight - scaledHeight) / 2;

        return new Vec3(offsetX, offsetY, 0);
    }
}

