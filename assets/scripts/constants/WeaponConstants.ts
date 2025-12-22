import { Color } from 'cc';

/**
 * 武器常量配置
 * 定义各种武器的属性配置
 */

/**
 * 武器类型枚举
 */
export enum WeaponType {
    BASIC = 'basic',       // 基础武器
    LASER = 'laser',       // 激光武器
    ROCKET = 'rocket'      // 火箭塔
}

/**
 * 武器配置接口（运行时使用，属性从升级配置中获取）
 */
export interface WeaponConfig {
    type: WeaponType;
    attackSpeed: number;   // 攻击速度（攻击间隔，秒）
    damage: number;        // 攻击力
    range: number;         // 攻击范围（像素）
    health: number;        // 生命值
    cost?: number;         // 建造成本（可选，从升级配置中获取）
}

/**
 * 默认武器类型
 */
export const DEFAULT_WEAPON_TYPE = WeaponType.BASIC;

/**
 * 武器通用配置常量
 */
export const WEAPON_COMMON_CONFIG = {
    /** 子弹最大飞行距离倍数（相对于攻击范围） */
    BULLET_MAX_DISTANCE_MULTIPLIER: 2.0
} as const;

/**
 * 武器颜色配置
 * 定义各种武器的显示颜色
 */
export const WEAPON_COLORS: Record<WeaponType, Color> = {
    [WeaponType.BASIC]: Color.RED,                    // 红色 - 基础武器
    [WeaponType.LASER]: Color.CYAN,                   // 青色 - 激光武器
    [WeaponType.ROCKET]: new Color(255, 165, 0, 255) // 橙色 - 火箭塔
};

/**
 * 获取武器颜色
 * @param type 武器类型
 * @returns 武器颜色
 */
export function getWeaponColor(type: WeaponType): Color {
    return WEAPON_COLORS[type] || Color.RED;
}

