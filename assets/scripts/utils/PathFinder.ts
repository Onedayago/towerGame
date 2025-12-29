import { Vec3 } from 'cc';
import { PathFinderUtils } from './PathFinderUtils';

/**
 * 网格节点（用于A*寻路）
 */
interface GridNode {
    x: number;  // 网格X坐标（格子索引）
    y: number;  // 网格Y坐标（格子索引）
    g: number;  // 从起点到当前节点的实际代价
    h: number;  // 从当前节点到终点的启发式估计代价
    f: number;  // f = g + h
    parent: GridNode | null;  // 父节点（用于回溯路径）
}

/**
 * A*寻路算法
 * 用于计算敌人从起点到终点的路径，避开武器
 */
export class PathFinder {
    private utils: PathFinderUtils = new PathFinderUtils();
    private tempObstacle: string | null = null; // 临时障碍物位置（格式："gridX,gridY"）

    /**
     * 初始化寻路器
     * @param containerWidth 容器宽度
     * @param containerHeight 容器高度
     * @param weaponManager 武器管理器（可选，用于将武器作为障碍物）
     */
    init(containerWidth: number, containerHeight: number, weaponManager?: any) {
        this.utils.init(containerWidth, containerHeight, weaponManager);
    }
    
    /**
     * 设置武器管理器（用于将武器作为障碍物）
     * @param weaponManager 武器管理器
     */
    setWeaponManager(weaponManager: any) {
        this.utils.setWeaponManager(weaponManager);
    }

    /**
     * 将世界坐标转换为网格坐标
     * @param worldX 世界X坐标
     * @param worldY 世界Y坐标
     * @returns 网格坐标 {x, y}
     */
    worldToGrid(worldX: number, worldY: number): { x: number; y: number } {
        return this.utils.worldToGrid(worldX, worldY);
    }

    /**
     * 将网格坐标转换为世界坐标（格子中心）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 世界坐标 {x, y}（格子中心）
     */
    gridToWorld(gridX: number, gridY: number): { x: number; y: number } {
        return this.utils.gridToWorld(gridX, gridY);
    }

    /**
     * 公开方法：检查网格位置是否可通行（供外部调用）
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @returns 是否可通行
     */
    public isWalkablePublic(gridX: number, gridY: number): boolean {
        return this.utils.isWalkablePublic(gridX, gridY, this.tempObstacle || undefined);
    }

    /**
     * 计算两个网格节点之间的曼哈顿距离（启发式函数）
     * @param node1 节点1
     * @param node2 节点2
     * @returns 曼哈顿距离
     */
    private manhattanDistance(node1: GridNode, node2: GridNode): number {
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
    }

    /**
     * 获取节点的邻居节点（上下左右四个方向）
     * @param node 当前节点
     * @returns 邻居节点数组
     */
    private getNeighbors(node: GridNode): GridNode[] {
        const neighbors: GridNode[] = [];
        const directions = [
            { x: 0, y: 1 },   // 上
            { x: 0, y: -1 },  // 下
            { x: 1, y: 0 },   // 右
            { x: -1, y: 0 }   // 左
        ];

        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;

            // 使用 this.isWalkablePublic 而不是 this.utils.isWalkablePublic，以便使用临时障碍物
            if (this.isWalkablePublic(newX, newY)) {
                neighbors.push({
                    x: newX,
                    y: newY,
                    g: 0,
                    h: 0,
                    f: 0,
                    parent: null
                });
            }
        }

        return neighbors;
    }

    /**
     * 查找路径
     * @param startX 起点世界X坐标
     * @param startY 起点世界Y坐标
     * @param endX 终点世界X坐标
     * @param endY 终点世界Y坐标
     * @param tempObstacleGridX 临时障碍物的网格X坐标（可选）
     * @param tempObstacleGridY 临时障碍物的网格Y坐标（可选）
     * @returns 路径点数组（世界坐标，格子中心），如果找不到路径则返回空数组
     */
    findPath(startX: number, startY: number, endX: number, endY: number, tempObstacleGridX?: number, tempObstacleGridY?: number): Vec3[] {
        if (!this.utils || !this.utils.isInitialized()) {
            return [];
        }

        // 设置临时障碍物（如果提供）
        const originalTempObstacle = this.tempObstacle;
        if (tempObstacleGridX !== undefined && tempObstacleGridY !== undefined) {
            this.tempObstacle = `${tempObstacleGridX},${tempObstacleGridY}`;
        } else {
            this.tempObstacle = null;
        }

        try {
            // 转换为网格坐标
            const startGrid = this.worldToGrid(startX, startY);
            const endGrid = this.worldToGrid(endX, endY);

            // 检查起点和终点是否可通行（使用 this.isWalkablePublic 以便考虑临时障碍物）
            if (!this.isWalkablePublic(startGrid.x, startGrid.y)) {
                return [];
            }

            if (!this.isWalkablePublic(endGrid.x, endGrid.y)) {
                // 如果终点不可通行，尝试找到最近的可通行点
                const nearestWalkable = this.findNearestWalkable(endGrid.x, endGrid.y);
                if (nearestWalkable) {
                    endGrid.x = nearestWalkable.x;
                    endGrid.y = nearestWalkable.y;
                } else {
                    return [];
                }
            }

            // 如果起点和终点相同，返回包含起点的路径
            if (startGrid.x === endGrid.x && startGrid.y === endGrid.y) {
                const worldPos = this.gridToWorld(startGrid.x, startGrid.y);
                return [new Vec3(worldPos.x, worldPos.y, 0)];
            }

        // A*算法
        const openSet: GridNode[] = [];
        const closedSet: Set<string> = new Set();

        // 创建起点节点
        const startNode: GridNode = {
            x: startGrid.x,
            y: startGrid.y,
            g: 0,
            h: 0,
            f: 0,
            parent: null
        };

        // 创建终点节点（用于计算h值）
        const endNode: GridNode = {
            x: endGrid.x,
            y: endGrid.y,
            g: 0,
            h: 0,
            f: 0,
            parent: null
        };

        startNode.h = this.manhattanDistance(startNode, endNode);
        startNode.f = startNode.g + startNode.h;

        openSet.push(startNode);

        while (openSet.length > 0) {
            // 找到f值最小的节点
            let currentIndex = 0;
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < openSet[currentIndex].f) {
                    currentIndex = i;
                }
            }

            const current = openSet.splice(currentIndex, 1)[0];
            const currentKey = `${current.x},${current.y}`;
            closedSet.add(currentKey);

            // 如果到达终点，回溯路径
            if (current.x === endNode.x && current.y === endNode.y) {
                const path: Vec3[] = [];
                let node: GridNode | null = current;

                while (node) {
                    const worldPos = this.gridToWorld(node.x, node.y);
                    path.unshift(new Vec3(worldPos.x, worldPos.y, 0));
                    node = node.parent;
                }

                return path;
            }

            // 检查邻居节点
            const neighbors = this.getNeighbors(current);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;

                // 如果已经在关闭列表中，跳过
                if (closedSet.has(neighborKey)) {
                    continue;
                }

                // 计算g值（从起点到当前邻居的代价）
                const tentativeG = current.g + 1; // 每个格子的代价为1

                // 检查是否在开放列表中
                const openNode = openSet.find(n => n.x === neighbor.x && n.y === neighbor.y);

                if (!openNode) {
                    // 不在开放列表中，添加
                    neighbor.g = tentativeG;
                    neighbor.h = this.manhattanDistance(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                    openSet.push(neighbor);
                } else if (tentativeG < openNode.g) {
                    // 在开放列表中，但找到了更短的路径，更新
                    openNode.g = tentativeG;
                    openNode.f = openNode.g + openNode.h;
                    openNode.parent = current;
                }
            }
        }

            // 没有找到路径
            return [];
        } finally {
            // 清除临时障碍物
            this.tempObstacle = originalTempObstacle;
        }
    }

    /**
     * 查找最近的可通行点
     * @param gridX 网格X坐标
     * @param gridY 网格Y坐标
     * @param maxRadius 最大搜索半径（格子数）
     * @returns 最近的可通行点，如果找不到则返回null
     */
    private findNearestWalkable(gridX: number, gridY: number, maxRadius: number = 5): { x: number; y: number } | null {
        for (let radius = 1; radius <= maxRadius; radius++) {
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    // 只检查半径边界上的点
                    if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
                        const checkX = gridX + dx;
                        const checkY = gridY + dy;
                        // 使用 this.isWalkablePublic 而不是 this.utils.isWalkablePublic，以便使用临时障碍物
                        if (this.isWalkablePublic(checkX, checkY)) {
                            return { x: checkX, y: checkY };
                        }
                    }
                }
            }
        }
        return null;
    }
}

