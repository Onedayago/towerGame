import { UiConfig } from '../config/Index';
import { ObstacleManager } from '../managers/ObstacleManager';

/**
 * PathFinder 工具方法
 * 提供坐标转换和可通行性检查
 */
export class PathFinderUtils {
    private obstacleManager: ObstacleManager | null = null;
    private containerWidth: number = 0;
    private containerHeight: number = 0;
    private cellSize: number = UiConfig.CELL_SIZE;

    /**
     * 初始化工具
     */
    init(obstacleManager: ObstacleManager, containerWidth: number, containerHeight: number) {
        this.obstacleManager = obstacleManager;
        this.containerWidth = containerWidth;
        this.containerHeight = containerHeight;
    }

    /**
     * 将世界坐标转换为网格坐标
     * @param worldX 世界X坐标
     * @param worldY 世界Y坐标
     * @returns 网格坐标 {x, y}
     */
    worldToGrid(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: Math.floor(worldX / this.cellSize),
            y: Math.floor(worldY / this.cellSize)
        };
    }

    /**
     * 将网格坐标转换为世界坐标（格子中心）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 世界坐标 {x, y}（格子中心）
     */
    gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
        return {
            x: gridX * this.cellSize + this.cellSize / 2,
            y: gridY * this.cellSize + this.cellSize / 2
        };
    }

    /**
     * 检查网格坐标是否在边界内
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否在边界内
     */
    isValidGrid(gridX: number, gridY: number): boolean {
        const maxGridX = Math.floor(this.containerWidth / this.cellSize);
        const maxGridY = Math.floor(this.containerHeight / this.cellSize);
        return gridX >= 0 && gridX < maxGridX && gridY >= 0 && gridY < maxGridY;
    }

    /**
     * 检查是否已初始化
     */
    isInitialized(): boolean {
        return this.obstacleManager !== null;
    }

    /**
     * 检查网格位置是否有障碍物
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否有障碍物
     */
    private hasObstacle(gridX: number, gridY: number): boolean {
        if (!this.obstacleManager) return false;
        
        // 使用格子左下角坐标检查障碍物
        const checkX = gridX * this.cellSize;
        const checkY = gridY * this.cellSize;
        return this.obstacleManager.hasObstacleAt(checkX, checkY);
    }

    /**
     * 检查网格位置是否可通行
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否可通行
     */
    isWalkable(gridX: number, gridY: number): boolean {
        if (!this.isValidGrid(gridX, gridY)) {
            return false;
        }
        return !this.hasObstacle(gridX, gridY);
    }

    /**
     * 公开方法：检查网格位置是否可通行（供外部调用）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否可通行
     */
    isWalkablePublic(gridX: number, gridY: number): boolean {
        return this.isWalkable(gridX, gridY);
    }
}

