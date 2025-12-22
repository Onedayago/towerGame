/**
 * 子弹常量配置
 * 定义各种子弹的属性配置
 */

/**
 * 子弹类型枚举
 */
export enum BulletType {
    // 武器子弹
    WEAPON_BASIC = 'weapon_basic',   // 基础武器子弹
    WEAPON_LASER = 'weapon_laser',   // 激光武器子弹
    WEAPON_ROCKET = 'weapon_rocket', // 火箭塔子弹
    
    // 敌人子弹
    ENEMY_TANK = 'enemy_tank',       // 坦克子弹
    ENEMY_FAST_TANK = 'enemy_fast_tank', // 快速坦克子弹
    ENEMY_HEAVY_TANK = 'enemy_heavy_tank', // 重型坦克子弹
    ENEMY_BOSS = 'enemy_boss'        // Boss子弹
}

/**
 * 子弹配置接口
 */
export interface BulletConfig {
    type: BulletType;
    speed: number;       // 子弹速度（像素/秒）
    damage: number;      // 子弹伤害（如果为0，则使用发射者的伤害）
    maxDistance: number; // 最大飞行距离（像素）
}

/**
 * 子弹配置表
 * 参考微信小游戏的配置：基础速度200像素/秒，不同子弹类型使用不同的速度倍数
 */
export const BULLET_CONFIGS: Record<BulletType, BulletConfig> = {
    // 武器子弹配置
    [BulletType.WEAPON_BASIC]: {
        type: BulletType.WEAPON_BASIC,
        speed: 200,          // 基础武器子弹速度：200像素/秒（基础速度，参考加农炮）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 2000    // 最大飞行距离：2000像素
    },
    [BulletType.WEAPON_LASER]: {
        type: BulletType.WEAPON_LASER,
        speed: 180,          // 激光武器子弹速度：180像素/秒（减小速度）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 2500    // 最大飞行距离：2500像素
    },
    [BulletType.WEAPON_ROCKET]: {
        type: BulletType.WEAPON_ROCKET,
        speed: 300,          // 火箭塔子弹速度：300像素/秒（基础速度 * 1.5，参考追踪火箭）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 3000    // 最大飞行距离：3000像素
    },
    
    // 敌人子弹配置
    [BulletType.ENEMY_TANK]: {
        type: BulletType.ENEMY_TANK,
        speed: 120,          // 坦克子弹速度：120像素/秒（原速度的30%）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 1500    // 最大飞行距离：1500像素
    },
    [BulletType.ENEMY_FAST_TANK]: {
        type: BulletType.ENEMY_FAST_TANK,
        speed: 150,          // 快速坦克子弹速度：150像素/秒（原速度的30%）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 1200    // 最大飞行距离：1200像素
    },
    [BulletType.ENEMY_HEAVY_TANK]: {
        type: BulletType.ENEMY_HEAVY_TANK,
        speed: 105,          // 重型坦克子弹速度：105像素/秒（原速度的30%）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 1800    // 最大飞行距离：1800像素
    },
    [BulletType.ENEMY_BOSS]: {
        type: BulletType.ENEMY_BOSS,
        speed: 135,          // Boss子弹速度：135像素/秒（原速度的30%）
        damage: 0,           // 0表示使用发射者的伤害
        maxDistance: 2000    // 最大飞行距离：2000像素
    }
};

/**
 * 获取子弹配置
 * @param type 子弹类型
 * @returns 子弹配置
 */
export function getBulletConfig(type: BulletType): BulletConfig {
    return BULLET_CONFIGS[type] || BULLET_CONFIGS[BulletType.WEAPON_BASIC];
}

/**
 * 默认子弹类型
 */
export const DEFAULT_BULLET_TYPE = BulletType.WEAPON_BASIC;

