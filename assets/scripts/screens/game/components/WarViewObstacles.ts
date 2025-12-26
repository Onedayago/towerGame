import { Node, UITransform } from 'cc';
import { UiConfig } from '../../../config/Index';
import { ObstacleManager } from '../../../managers/ObstacleManager';

/**
 * WarView 障碍物生成助手
 * 负责生成随机障碍物
 */
export class WarViewObstacles {
    private warViewNode: Node;
    private baseNode: Node | null;
    private obstacleManager: ObstacleManager | null;

    constructor(warViewNode: Node, baseNode: Node | null, obstacleManager: ObstacleManager | null) {
        this.warViewNode = warViewNode;
        this.baseNode = baseNode;
        this.obstacleManager = obstacleManager;
    }

    /**
     * 随机生成障碍物
     * @param count 生成数量（可选，如果不指定则根据密度计算）
     * @param density 生成密度（0-1，表示占用格子的比例，默认 0.15 即 15%）
     */
    generateRandomObstacles(count?: number, density: number = 0.15) {
        if (!this.obstacleManager) return;
        
        const transform = this.warViewNode.getComponent(UITransform);
        if (!transform) return;
        
        const width = transform.width;
        const height = transform.height;
        
        // 计算基地周围3个格子范围的排除位置
        const excludePositions: { x: number; y: number }[] = [];
        if (this.baseNode) {
            const basePos = this.baseNode.position;
            const baseTransform = this.baseNode.getComponent(UITransform);
            if (baseTransform) {
                const cellSize = UiConfig.CELL_SIZE;
                const baseWidth = baseTransform.width;
                const baseHeight = baseTransform.height;
                
                // 基地占据的格子范围
                const baseStartCol = Math.floor(basePos.x / cellSize);
                const baseEndCol = Math.floor((basePos.x + baseWidth) / cellSize);
                const baseStartRow = Math.floor(basePos.y / cellSize);
                const baseEndRow = Math.floor((basePos.y + baseHeight) / cellSize);
                
                // 基地周围3个格子的范围
                const excludeStartCol = Math.max(0, baseStartCol - 3);
                const excludeEndCol = Math.min(Math.floor(width / cellSize) - 1, baseEndCol + 3);
                const excludeStartRow = Math.max(0, baseStartRow - 3);
                const excludeEndRow = Math.min(Math.floor(height / cellSize) - 1, baseEndRow + 3);
                
                // 生成所有需要排除的格子位置
                for (let row = excludeStartRow; row <= excludeEndRow; row++) {
                    for (let col = excludeStartCol; col <= excludeEndCol; col++) {
                        const gridX = col * cellSize;
                        const gridY = row * cellSize;
                        excludePositions.push({ x: gridX, y: gridY });
                    }
                }
            }
        }
        
        this.obstacleManager.generateRandomObstacles(count, density, width, height, excludePositions);
    }
}

