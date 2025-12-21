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
 * 武器配置接口
 */
export interface WeaponConfig {
    type: WeaponType;
    attackSpeed: number;   // 攻击速度（攻击间隔，秒）
    damage: number;        // 攻击力
    range: number;         // 攻击范围（像素）
    health: number;        // 生命值
    cost?: number;         // 建造成本（可选）
}

/**
 * 武器配置表
 */
export const WEAPON_CONFIGS: Record<WeaponType, WeaponConfig> = {
    [WeaponType.BASIC]: {
        type: WeaponType.BASIC,
        attackSpeed: 1.0,   // 每秒攻击1次
        damage: 15,
        range: 450,          // 攻击范围：450像素（确保大于所有敌人的最大攻击范围400）
        health: 300,          // 生命值：300
        cost: 50
    },
    [WeaponType.LASER]: {
        type: WeaponType.LASER,
        attackSpeed: 0.3,   // 每秒攻击约3.3次（高频率）
        damage: 12,
        range: 500,          // 攻击范围：500像素（确保大于所有敌人的最大攻击范围400）
        health: 250,          // 生命值：250
        cost: 80
    },
    [WeaponType.ROCKET]: {
        type: WeaponType.ROCKET,
        attackSpeed: 2.5,   // 每2.5秒攻击1次（低频率高伤害）
        damage: 50,
        range: 550,          // 攻击范围：550像素（确保大于所有敌人的最大攻击范围400）
        health: 400,          // 生命值：400
        cost: 120
    }
};

/**
 * 获取武器配置
 * @param type 武器类型
 * @returns 武器配置
 */
export function getWeaponConfig(type: WeaponType): WeaponConfig {
    return WEAPON_CONFIGS[type] || WEAPON_CONFIGS[WeaponType.BASIC];
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

