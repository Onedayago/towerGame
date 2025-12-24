import { Node, Prefab, instantiate, UITransform } from 'cc';
import { ObstacleType } from '../constants/Index';
import { ObstacleBase } from '../obstacles/Index';
import { UiConfig } from '../config/Index';

/**
 * 障碍物管理器
 * 管理战场上的所有障碍物
 */
export class ObstacleManager {
    private containerNode: Node;
    private obstacles: Node[] = [];
    private obstaclePrefabs: Map<ObstacleType, Prefab> = new Map();

    constructor(containerNode: Node, obstaclePrefabs: Map<ObstacleType, Prefab> | null = null) {
        this.containerNode = containerNode;
        
        if (obstaclePrefabs) {
            this.obstaclePrefabs = obstaclePrefabs;
        }
    }

    /**
     * 添加障碍物预制体
     * @param type 障碍物类型
     * @param prefab 预制体
     */
    addObstaclePrefab(type: ObstacleType, prefab: Prefab) {
        this.obstaclePrefabs.set(type, prefab);
    }

    /**
     * 在指定位置创建障碍物
     * @param type 障碍物类型
     * @param x X坐标（网格坐标）
     * @param y Y坐标（网格坐标）
     * @returns 创建的障碍物节点，如果失败则返回 null
     */
    createObstacle(type: ObstacleType, x: number, y: number): Node | null {
        const prefab = this.obstaclePrefabs.get(type);
        if (!prefab) {
            console.warn(`障碍物预制体不存在: ${type}`);
            return null;
        }

        // 实例化预制体
        const obstacleNode = instantiate(prefab);
        if (!obstacleNode) return null;

        // 设置父节点
        obstacleNode.setParent(this.containerNode);

        // 对齐到网格
        const gridX = Math.floor(x / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        const gridY = Math.floor(y / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        obstacleNode.setPosition(gridX, gridY, 0);

        // 添加到障碍物列表
        this.obstacles.push(obstacleNode);

        return obstacleNode;
    }

    /**
     * 添加障碍物节点（直接添加已创建的节点）
     * @param obstacleNode 障碍物节点
     */
    addObstacle(obstacleNode: Node) {
        if (!obstacleNode || !obstacleNode.isValid) return;

        // 确保障碍物节点是容器的子节点
        if (obstacleNode.parent !== this.containerNode) {
            obstacleNode.setParent(this.containerNode);
        }

        // 检查是否已存在
        if (this.obstacles.indexOf(obstacleNode) === -1) {
            this.obstacles.push(obstacleNode);
        }
    }

    /**
     * 移除障碍物
     * @param obstacleNode 障碍物节点
     */
    removeObstacle(obstacleNode: Node) {
        const index = this.obstacles.indexOf(obstacleNode);
        if (index !== -1) {
            this.obstacles.splice(index, 1);
        }
    }

    /**
     * 检查指定位置是否有障碍物
     * @param x X坐标（网格坐标）
     * @param y Y坐标（网格坐标）
     * @returns 是否有障碍物
     */
    hasObstacleAt(x: number, y: number): boolean {
        const gridX = Math.floor(x / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        const gridY = Math.floor(y / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        const epsilon = 0.1; // 允许的误差范围

        for (const obstacle of this.obstacles) {
            if (!obstacle || !obstacle.isValid) continue;

            const obstaclePos = obstacle.position;
            if (Math.abs(obstaclePos.x - gridX) < epsilon && Math.abs(obstaclePos.y - gridY) < epsilon) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取指定位置的障碍物
     * @param x X坐标（网格坐标）
     * @param y Y坐标（网格坐标）
     * @returns 障碍物节点，如果没有则返回 null
     */
    getObstacleAt(x: number, y: number): Node | null {
        const gridX = Math.floor(x / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        const gridY = Math.floor(y / UiConfig.CELL_SIZE) * UiConfig.CELL_SIZE;
        const epsilon = 0.1; // 允许的误差范围

        for (const obstacle of this.obstacles) {
            if (!obstacle || !obstacle.isValid) continue;

            const obstaclePos = obstacle.position;
            if (Math.abs(obstaclePos.x - gridX) < epsilon && Math.abs(obstaclePos.y - gridY) < epsilon) {
                return obstacle;
            }
        }
        return null;
    }

    /**
     * 清理所有障碍物
     */
    clearAll() {
        this.obstacles.forEach(obstacle => {
            if (obstacle && obstacle.isValid) {
                obstacle.destroy();
            }
        });
        this.obstacles = [];
    }

    /**
     * 获取障碍物数量
     */
    getObstacleCount(): number {
        return this.obstacles.length;
    }

    /**
     * 获取所有障碍物节点
     */
    getAllObstacles(): Node[] {
        return this.obstacles.slice(); // 返回副本，避免外部修改
    }
    
    /**
     * 随机生成障碍物
     * @param count 生成数量（可选，如果不指定则根据密度计算）
     * @param density 生成密度（0-1，表示占用格子的比例，默认 0.15 即 15%）
     * @param containerWidth 容器宽度（用于计算格子数量）
     * @param containerHeight 容器高度（用于计算格子数量）
     * @param excludePositions 排除的位置列表（可选，用于避免在某些位置生成）
     */
    generateRandomObstacles(
        count?: number,
        density: number = 0.15,
        containerWidth?: number,
        containerHeight?: number,
        excludePositions: { x: number; y: number }[] = []
    ): void {
        // 获取容器尺寸
        const transform = this.containerNode.getComponent(UITransform);
        if (!transform) {
            console.warn('ObstacleManager: 无法获取容器尺寸');
            return;
        }
        
        const width = containerWidth || transform.width;
        const height = containerHeight || transform.height;
        
        // 计算格子数量
        const cellCountX = Math.floor(width / UiConfig.CELL_SIZE);
        const cellCountY = Math.floor(height / UiConfig.CELL_SIZE);
        const EXCLUDED_COLUMNS = 3; // 左边三列不生成障碍物
        
        // 计算可用格子数量（排除左边三列）
        const availableCellCountX = cellCountX - EXCLUDED_COLUMNS;
        const totalCells = availableCellCountX * cellCountY;
        
        // 计算生成数量
        let obstacleCount = count;
        if (obstacleCount === undefined) {
            obstacleCount = Math.floor(totalCells * density);
        }
        
        // 限制生成数量，不能超过可用格子数
        obstacleCount = Math.min(obstacleCount, totalCells - excludePositions.length);
        
        // 获取可用的障碍物类型
        const availableTypes = Array.from(this.obstaclePrefabs.keys());
        if (availableTypes.length === 0) {
            console.warn('ObstacleManager: 没有可用的障碍物预制体');
            return;
        }
        
        // 生成所有可能的格子位置
        const allPositions: { x: number; y: number }[] = [];
        
        for (let y = 0; y < cellCountY; y++) {
            for (let x = 0; x < cellCountX; x++) {
                // 排除左边三列
                if (x < EXCLUDED_COLUMNS) {
                    continue;
                }
                
                const gridX = x * UiConfig.CELL_SIZE;
                const gridY = y * UiConfig.CELL_SIZE;
                
                // 检查是否在排除列表中
                const isExcluded = excludePositions.some(pos => 
                    Math.abs(pos.x - gridX) < 0.1 && Math.abs(pos.y - gridY) < 0.1
                );
                
                if (!isExcluded) {
                    allPositions.push({ x: gridX, y: gridY });
                }
            }
        }
        
        // 随机打乱位置列表
        this.shuffleArray(allPositions);
        
        // 生成障碍物
        let generatedCount = 0;
        for (let i = 0; i < allPositions.length && generatedCount < obstacleCount; i++) {
            const pos = allPositions[i];
            
            // 检查位置是否已有障碍物
            if (this.hasObstacleAt(pos.x, pos.y)) {
                continue;
            }
            
            // 随机选择障碍物类型
            const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            
            // 创建障碍物
            const obstacle = this.createObstacle(randomType, pos.x, pos.y);
            if (obstacle) {
                generatedCount++;
            }
        }
        
        console.log(`ObstacleManager: 随机生成了 ${generatedCount} 个障碍物`);
    }
    
    /**
     * 打乱数组（Fisher-Yates 洗牌算法）
     */
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

