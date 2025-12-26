import { Vec3, Node } from 'cc';
import { PathFinder } from '../utils/PathFinder';
import { UiConfig } from '../config/Index';

/**
 * 敌人寻路管理器
 * 负责处理敌人的寻路和移动逻辑
 */
export class EnemyPathfinding {
    private pathFinder: PathFinder | null = null;
    private baseTarget: Vec3 | null = null;
    private path: Vec3[] = [];
    private currentPathIndex: number = 0;
    private targetPosition: Vec3 | null = null;
    private needsPathUpdate: boolean = true;
    private enemyNode: Node;
    private appearanceNode: Node | null = null; // 外观节点（用于旋转）
    private moveSpeed: number = 0;
    private readonly EPSILON = 0.5; // 到达格子中心的误差范围

    constructor(enemyNode: Node, moveSpeed: number, appearanceNode: Node | null = null) {
        this.enemyNode = enemyNode;
        this.appearanceNode = appearanceNode;
        this.moveSpeed = moveSpeed;
    }
    
    /**
     * 设置外观节点
     */
    setAppearanceNode(appearanceNode: Node | null) {
        this.appearanceNode = appearanceNode;
    }

    /**
     * 设置寻路器和基地目标位置
     */
    setPathfinding(pathFinder: PathFinder, baseTarget: Vec3) {
        if (this.pathFinder !== pathFinder || !this.baseTarget || 
            this.baseTarget.x !== baseTarget.x || this.baseTarget.y !== baseTarget.y) {
            this.pathFinder = pathFinder;
            this.baseTarget = baseTarget;
            this.needsPathUpdate = true;
        }
    }

    /**
     * 更新移动
     * @param deltaTime 帧时间
     * @returns 是否成功移动
     */
    update(deltaTime: number): boolean {
        if (!this.pathFinder || !this.baseTarget) {
            // 如果没有寻路器，使用简单向右移动
            const currentPos = this.enemyNode.position;
            const newX = currentPos.x + this.moveSpeed * deltaTime;
            // 面向右方
            const rightDirection = new Vec3(1, 0, 0);
            this.updateRotation(rightDirection);
            this.enemyNode.setPosition(newX, currentPos.y, 0);
            return false;
        }

        return this.updatePositionWithPathfinding(deltaTime);
    }

    /**
     * 使用寻路算法更新位置
     */
    private updatePositionWithPathfinding(deltaTime: number): boolean {
        if (!this.pathFinder || !this.baseTarget) {
            return false;
        }

        const currentPos = this.enemyNode.position;

        // 如果路径为空，需要初始化路径
        if (this.path.length === 0 || this.needsPathUpdate) {
            this.calculatePath();
            this.needsPathUpdate = false;

            // 如果计算路径后仍然为空，使用简单移动
            if (this.path.length === 0) {
                const newX = currentPos.x + this.moveSpeed * deltaTime;
                // 简单移动时，面向右方
                const rightDirection = new Vec3(1, 0, 0);
                this.updateRotation(rightDirection);
                this.enemyNode.setPosition(newX, currentPos.y, 0);
                return false;
            }
        }

        // 如果还没有目标位置，设置第一个路径点为目标
        if (!this.targetPosition) {
            if (this.currentPathIndex < this.path.length) {
                this.targetPosition = this.path[this.currentPathIndex];
            } else {
                this.targetPosition = this.baseTarget;
            }
        }

        // 检查是否到达当前目标位置（格子中心）
        const distanceToTarget = Vec3.distance(currentPos, this.targetPosition);

        if (distanceToTarget <= this.EPSILON) {
            // 已到达目标格子中心，检查下一个格子是否被阻挡
            this.currentPathIndex++;

            if (this.currentPathIndex < this.path.length) {
                const nextTarget = this.path[this.currentPathIndex];
                const nextGrid = this.pathFinder.worldToGrid(nextTarget.x, nextTarget.y);

                // 检查下一个格子是否被阻挡
                if (!this.pathFinder.isWalkablePublic(nextGrid.x, nextGrid.y)) {
                    // 下一个格子被阻挡，重新计算路径
                    this.needsPathUpdate = true;
                    this.path = [];
                    this.currentPathIndex = 0;
                    this.targetPosition = null;
                    return false; // 下一帧会重新计算路径
                }

                this.targetPosition = nextTarget;
            } else {
                this.targetPosition = this.baseTarget;
            }
        } else {
            // 向目标位置移动
            const direction = new Vec3();
            Vec3.subtract(direction, this.targetPosition, currentPos);
            const directionLength = Vec3.len(direction);

            if (directionLength < 0.001) {
                this.enemyNode.setPosition(this.targetPosition);
                return true;
            }

            Vec3.normalize(direction, direction);
            
            // 根据移动方向旋转敌人外观
            this.updateRotation(direction);
            
            const moveDistance = this.moveSpeed * deltaTime;
            const newPos = new Vec3();
            Vec3.scaleAndAdd(newPos, currentPos, direction, moveDistance);

            // 确保不会超过目标位置
            const newDistanceToTarget = Vec3.distance(newPos, this.targetPosition);
            if (newDistanceToTarget < distanceToTarget) {
                this.enemyNode.setPosition(newPos);
            } else {
                this.enemyNode.setPosition(this.targetPosition);
            }
        }

        return true;
    }

    /**
     * 计算路径
     */
    private calculatePath() {
        if (!this.pathFinder || !this.baseTarget) {
            this.path = [];
            this.currentPathIndex = 0;
            this.targetPosition = null;
            return;
        }

        const currentPos = this.enemyNode.position;
        const path = this.pathFinder.findPath(
            currentPos.x,
            currentPos.y,
            this.baseTarget.x,
            this.baseTarget.y
        );

        if (path.length > 0) {
            this.path = path;
            this.currentPathIndex = 0;
            this.targetPosition = null;
        } else {
            this.path = [];
            this.currentPathIndex = 0;
            this.targetPosition = null;
        }
    }

    /**
     * 设置移动速度
     */
    setMoveSpeed(speed: number) {
        this.moveSpeed = speed;
    }
    
    /**
     * 根据移动方向更新敌人外观旋转
     * @param direction 移动方向向量（已归一化）
     */
    private updateRotation(direction: Vec3) {
        if (!this.appearanceNode) return;
        
        // 计算角度（弧度转角度）
        const angleRad = Math.atan2(direction.y, direction.x);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // 更新外观节点旋转
        this.appearanceNode.setRotationFromEuler(0, 0, angleDeg);
    }
}

