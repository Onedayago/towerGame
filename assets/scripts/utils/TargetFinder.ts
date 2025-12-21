import { Node, Vec3 } from 'cc';

/**
 * 目标查找器
 * 提供通用的目标查找功能，用于敌人和武器查找攻击目标
 */
export class TargetFinder {
    /**
     * 查找范围内的最近目标
     * @param sourcePos 源位置（查找者的位置）
     * @param targets 目标节点数组
     * @param range 攻击范围（像素）
     * @param filter 可选的过滤函数，用于过滤目标（例如：只攻击特定方向的目标）
     * @returns 最近的目标节点，如果没有则返回 null
     */
    static findNearestInRange(
        sourcePos: Vec3,
        targets: Node[],
        range: number,
        filter?: (sourcePos: Vec3, targetPos: Vec3, distance: number) => boolean
    ): Node | null {
        if (targets.length === 0) return null;

        const sourceCenter = new Vec3(sourcePos.x, sourcePos.y, 0);
        let nearestTarget: Node | null = null;
        let nearestDistance = range;

        // 遍历所有目标，找到最近的且在攻击范围内的目标
        for (const target of targets) {
            if (!target || !target.isValid) continue;

            // 目标中心位置（锚点为中心）
            const targetPos = target.position;
            const targetCenter = new Vec3(targetPos.x, targetPos.y, 0);

            // 计算距离
            const distance = Vec3.distance(sourceCenter, targetCenter);

            // 检查是否在攻击范围内
            if (distance > range) continue;

            // 应用过滤条件（如果提供）
            if (filter && !filter(sourcePos, targetPos, distance)) continue;

            // 检查是否是最近的目标
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestTarget = target;
            }
        }

        return nearestTarget;
    }

    /**
     * 创建方向过滤器（只攻击特定方向的目标）
     * @param direction 方向：'right'（右侧）、'left'（左侧）、'front'（前方）、'back'（后方）
     * @returns 过滤函数
     */
    static createDirectionFilter(direction: 'right' | 'left' | 'front' | 'back'): (sourcePos: Vec3, targetPos: Vec3, distance: number) => boolean {
        return (sourcePos: Vec3, targetPos: Vec3, distance: number): boolean => {
            switch (direction) {
                case 'right':
                    return targetPos.x > sourcePos.x;
                case 'left':
                    return targetPos.x < sourcePos.x;
                case 'front':
                    return targetPos.y > sourcePos.y;
                case 'back':
                    return targetPos.y < sourcePos.y;
                default:
                    return true;
            }
        };
    }

    /**
     * 检查目标是否在范围内
     * @param sourcePos 源位置
     * @param targetPos 目标位置
     * @param range 攻击范围（像素）
     * @returns 是否在范围内
     */
    static isInRange(sourcePos: Vec3, targetPos: Vec3, range: number): boolean {
        const sourceCenter = new Vec3(sourcePos.x, sourcePos.y, 0);
        const targetCenter = new Vec3(targetPos.x, targetPos.y, 0);
        const distance = Vec3.distance(sourceCenter, targetCenter);
        return distance <= range;
    }

    /**
     * 计算两点之间的距离
     * @param pos1 位置1
     * @param pos2 位置2
     * @returns 距离（像素）
     */
    static getDistance(pos1: Vec3, pos2: Vec3): number {
        const center1 = new Vec3(pos1.x, pos1.y, 0);
        const center2 = new Vec3(pos2.x, pos2.y, 0);
        return Vec3.distance(center1, center2);
    }
}

