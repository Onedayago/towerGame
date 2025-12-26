import { _decorator, Component, Node, Graphics, UITransform, Color, EventTouch, Vec2, Vec3 } from 'cc';
import { UiConfig } from '../../../config/Index';
import { WarView } from './Index';
import { WarContainer } from './Index';
import { DrawHelper } from '../../../utils/Index';
const { ccclass, property } = _decorator;

/**
 * 视图指示器组件
 * 在小地图上显示当前视野范围，支持拖拽控制 WarView 的视图展示
 */
@ccclass('ViewPoint')
export class ViewPoint extends Component {
    private graphics: Graphics | null = null;
    private warViewNode: Node | null = null;
    private warContainerNode: Node | null = null;
    private miniMapNode: Node | null = null;
    private isDragging: boolean = false;
    private lastTouchPos: Vec2 = new Vec2();
    
    // 更新间隔（秒）
    private readonly UPDATE_INTERVAL = 0.05;
    private updateTimer: number = 0;

    onLoad() {
        this.initGraphics();
        this.findNodes();
        this.initTransform();
        this.initEventListeners();
    }

    start() {
        // 初始化完成后绘制一次
        this.updateViewPoint();
    }

    /**
     * 初始化事件监听器
     */
    private initEventListeners() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        // 定时更新视图指示器位置（当不拖拽时）
        if (!this.isDragging) {
            this.updateTimer += deltaTime;
            if (this.updateTimer >= this.UPDATE_INTERVAL) {
                this.updateTimer = 0;
                this.updateViewPoint();
            }
        }
    }

    /**
     * 初始化 Graphics 组件
     */
    private initGraphics() {
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
    }

    /**
     * 初始化节点变换属性
     */
    private initTransform() {
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            this.node.addComponent(UITransform);
        }
    }

    /**
     * 查找相关节点
     */
    private findNodes() {
        const scene = this.node.scene;
        if (!scene) return;

        // 查找 MiniMap 节点（父节点）
        this.miniMapNode = this.node.parent;

        // 查找 WarView 节点
        this.warViewNode = this.findNodeWithComponent(scene, WarView);

        // 查找 WarContainer 节点
        this.warContainerNode = this.findNodeWithComponent(scene, WarContainer);
    }

    /**
     * 递归查找包含指定组件的节点
     */
    private findNodeWithComponent(node: Node, componentType: typeof Component): Node | null {
        if (node.getComponent(componentType)) {
            return node;
        }
        for (let child of node.children) {
            const result = this.findNodeWithComponent(child, componentType);
            if (result) {
                return result;
            }
        }
        return null;
    }

    /**
     * 更新视图指示器位置和绘制
     */
    private updateViewPoint() {
        if (!this.warViewNode || !this.warContainerNode || !this.miniMapNode) return;

        const warViewTransform = this.warViewNode.getComponent(UITransform);
        const warContainerTransform = this.warContainerNode.getComponent(UITransform);
        const miniMapTransform = this.miniMapNode.getComponent(UITransform);

        if (!warViewTransform || !warContainerTransform || !miniMapTransform) return;

        // 计算视野范围在小地图中的位置和尺寸
        const viewportInfo = this.calculateViewportInMiniMap(
            warViewTransform,
            warContainerTransform,
            miniMapTransform
        );

        // 更新节点位置和尺寸
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setAnchorPoint(0, 0);
            transform.setContentSize(viewportInfo.width, viewportInfo.height);
            this.node.setPosition(viewportInfo.x, viewportInfo.y, 0);
        }

        // 绘制视图指示器
        this.drawViewPoint(viewportInfo.width, viewportInfo.height);
    }

    /**
     * 计算视野范围在小地图中的位置和尺寸
     * 使用独立的 scaleX 和 scaleY，让内容充满整个小地图
     */
    private calculateViewportInMiniMap(
        warViewTransform: UITransform,
        warContainerTransform: UITransform,
        miniMapTransform: UITransform
    ): { x: number; y: number; width: number; height: number } {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;
        const viewportWidth = warContainerTransform.width;
        const viewportHeight = warContainerTransform.height;
        const miniMapWidth = miniMapTransform.width;
        const miniMapHeight = miniMapTransform.height;

        // 计算缩放比例（充满整个小地图，使用独立的 scaleX 和 scaleY）
        const scaleX = miniMapWidth / warViewWidth;
        const scaleY = miniMapHeight / warViewHeight;

        // 获取 WarView 的位置（相对于 WarContainer）
        // WarView 向左移动（X 减小）→ 视窗看到右边的内容 → ViewPoint 在小地图上向右移动（X 增加）
        // WarView 向下移动（Y 减小）→ 视窗看到上面的内容 → ViewPoint 在小地图上向上移动（Y 增加）
        // 所以 ViewPoint 的位置应该是 WarView 位置的相反方向
        const warViewPos = this.warViewNode.position;

        // 计算视野范围在小地图中的位置（充满整个小地图，不需要偏移）
        // WarView 的位置是相对于 WarContainer 的，需要转换为小地图坐标
        // WarView 在 WarContainer 中的位置 (warViewPos.x, warViewPos.y) 对应小地图中的位置
        // 由于 WarView 向左移动时，视窗看到右边内容，所以需要取反
        const viewportX = -warViewPos.x * scaleX;
        const viewportY = -warViewPos.y * scaleY;
        const viewportScaledWidth = viewportWidth * scaleX;
        const viewportScaledHeight = viewportHeight * scaleY;

        return {
            x: viewportX,
            y: viewportY,
            width: viewportScaledWidth,
            height: viewportScaledHeight
        };
    }

    /**
     * 绘制视图指示器
     */
    private drawViewPoint(width: number, height: number) {
        if (!this.graphics) return;

        DrawHelper.drawTransparentRect(
            this.graphics,
            0,
            0,
            width,
            height,
            new Color(255, 255, 0, 40),
            Color.YELLOW,
            2
        );
    }

    /**
     * 触摸开始事件处理
     */
    onTouchStart(event: EventTouch) {
        this.isDragging = true;
        const touchLocation = event.getUILocation();
        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    /**
     * 触摸移动事件处理
     */
    onTouchMove(event: EventTouch) {
        if (!this.isDragging || !this.warViewNode || !this.warContainerNode || !this.miniMapNode) return;

        // 获取触摸位置（UI 坐标）
        const touchLocation = event.getUILocation();
        
        // 将触摸位置转换为 MiniMap 的本地坐标
        const touchWorldPos = new Vec3(touchLocation.x, touchLocation.y, 0);
        const touchLocalPos = new Vec3();
        this.miniMapNode.inverseTransformPoint(touchLocalPos, touchWorldPos);

        // 获取上一次触摸位置在 MiniMap 的本地坐标
        const lastWorldPos = new Vec3(this.lastTouchPos.x, this.lastTouchPos.y, 0);
        const lastLocalPos = new Vec3();
        this.miniMapNode.inverseTransformPoint(lastLocalPos, lastWorldPos);

        // 计算在小地图中的增量
        const deltaX = touchLocalPos.x - lastLocalPos.x;
        const deltaY = touchLocalPos.y - lastLocalPos.y;

        // 计算缩放比例
        const warViewTransform = this.warViewNode.getComponent(UITransform);
        const warContainerTransform = this.warContainerNode.getComponent(UITransform);
        const miniMapTransform = this.miniMapNode.getComponent(UITransform);
        if (!warViewTransform || !warContainerTransform || !miniMapTransform) return;

        const scale = this.calculateScale(warViewTransform, warContainerTransform, miniMapTransform);

        // 将小地图坐标增量转换为 WarView 坐标增量
        // 在小地图上向右拖拽 ViewPoint → WarView 向左移动（X 减小）→ 视窗看到右边的内容
        // 在小地图上向上拖拽 ViewPoint → WarView 向下移动（Y 减小）→ 视窗看到上面的内容
        // 所以拖拽方向应该相反：向右拖拽 ViewPoint → WarView 向左移动（X 减小）
        const warViewDeltaX = -deltaX / scale.scaleX;
        const warViewDeltaY = -deltaY / scale.scaleY;

        // 更新 WarView 位置
        const currentPos = this.warViewNode.position;
        let newX = currentPos.x + warViewDeltaX;
        let newY = currentPos.y + warViewDeltaY;

        // 限制在容器范围内
        const clampedPos = this.clampWarViewPosition(newX, newY, warViewTransform, warContainerTransform);
        this.warViewNode.setPosition(clampedPos.x, clampedPos.y, 0);

        // 更新视图指示器位置
        this.updateViewPoint();

        this.lastTouchPos = new Vec2(touchLocation.x, touchLocation.y);
    }

    /**
     * 触摸结束事件处理
     */
    onTouchEnd(event: EventTouch) {
        this.isDragging = false;
    }

    /**
     * 计算缩放比例（充满整个小地图，使用独立的 scaleX 和 scaleY）
     */
    private calculateScale(
        warViewTransform: UITransform,
        warContainerTransform: UITransform,
        miniMapTransform: UITransform
    ): { scaleX: number; scaleY: number } {
        const warViewWidth = warViewTransform.width;
        const warViewHeight = warViewTransform.height;
        const miniMapWidth = miniMapTransform.width;
        const miniMapHeight = miniMapTransform.height;

        // 分别计算X和Y的缩放比例，让内容充满整个小地图
        const scaleX = miniMapWidth / warViewWidth;
        const scaleY = miniMapHeight / warViewHeight;
        
        return { scaleX, scaleY };
    }

    /**
     * 限制 WarView 位置在容器范围内
     */
    private clampWarViewPosition(
        x: number,
        y: number,
        warViewTransform: UITransform,
        warContainerTransform: UITransform
    ): { x: number; y: number } {
        const containerWidth = warContainerTransform.width;
        const containerHeight = warContainerTransform.height;
        const viewWidth = warViewTransform.width;
        const viewHeight = warViewTransform.height;

        // 限制 X 坐标
        // WarView 可以向左移动（X 为负），最大移动距离是 viewWidth - containerWidth
        // WarView 可以向右移动（X 为正），最大移动距离是 0
        const minX = containerWidth - viewWidth; // 最左边（负数或0）
        const maxX = 0; // 最右边（初始位置）
        x = Math.max(minX, Math.min(maxX, x));

        // 限制 Y 坐标（原点在左下角，Y轴向上）
        // WarView 可以向下移动（Y 为负），最大移动距离是 viewHeight - containerHeight
        // WarView 可以向上移动（Y 为正），最大移动距离是 0
        const minY = containerHeight - viewHeight; // 最下边（负数或0）
        const maxY = 0; // 最上边（初始位置）
        y = Math.max(minY, Math.min(maxY, y));

        return { x, y };
    }
}
