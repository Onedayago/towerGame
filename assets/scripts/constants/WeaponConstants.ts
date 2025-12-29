import { Color } from 'cc';
import { CyberpunkColors } from './CyberpunkColors';

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
    cost?: number;         // 建造成本（可选，从升级配置中获取）
}

/**
 * 武器单级升级配置
 */
export interface WeaponLevelConfig {
    /** 等级 */
    level: number;
    /** 生命值 */
    health: number;
    /** 攻击力 */
    damage: number;
    /** 攻击范围（像素） */
    range: number;
    /** 攻击速度（攻击间隔，秒） */
    attackSpeed: number;
    /** 升级到此等级所需的金币（从上一级升级到此级的成本） */
    upgradeCost: number;
    /** 出售此等级武器获得的金币 */
    sellPrice: number;
}

/**
 * 武器升级配置（包含所有等级）
 */
export interface WeaponUpgradeConfig {
    /** 武器类型 */
    type: WeaponType;
    /** 建造成本（购买武器所需金币） */
    buildCost: number;
    /** 最大等级 */
    maxLevel: number;
    /** 各等级配置 */
    levels: WeaponLevelConfig[];
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
 * 定义各种武器的显示颜色（赛博朋克风格）
 */
export const WEAPON_COLORS: Record<WeaponType, Color> = {
    [WeaponType.BASIC]: CyberpunkColors.WEAPON_BASIC,    // 霓虹蓝色 - 基础武器
    [WeaponType.LASER]: CyberpunkColors.WEAPON_LASER,    // 霓虹粉色 - 激光武器
    [WeaponType.ROCKET]: CyberpunkColors.WEAPON_ROCKET   // 霓虹橙色 - 火箭塔
};

/**
 * 武器升级配置表
 * 参考微信小游戏的配置
 */
export const WEAPON_UPGRADE_CONFIGS: Record<WeaponType, WeaponUpgradeConfig> = {
    [WeaponType.BASIC]: {
        type: WeaponType.BASIC,
        buildCost: 40,      // 建造成本（降低，提高性价比）
        maxLevel: 4,        // 只能升级3次（共4级）
        levels: [
            {
                level: 1,
                health: 300,
                damage: 18,
                range: 90,            // 1.5个格子（60 * 1.5 = 90）
                attackSpeed: 0.85,
                upgradeCost: 0,
                sellPrice: 20,
            },
            {
                level: 2,
                health: 360,
                damage: 22,
                range: 150,           // 2.5个格子（60 * 2.5 = 150）
                attackSpeed: 0.7,
                upgradeCost: 60,
                sellPrice: 40,
            },
            {
                level: 3,
                health: 432,
                damage: 27,
                range: 210,           // 3.5个格子（60 * 3.5 = 210）
                attackSpeed: 0.6,
                upgradeCost: 90,
                sellPrice: 60,
            },
            {
                level: 4,
                health: 518,
                damage: 33,
                range: 210,           // 3.5个格子（最后一次升级后保持）
                attackSpeed: 0.5,
                upgradeCost: 135,
                sellPrice: 85,
            },
        ],
    },
    [WeaponType.LASER]: {
        type: WeaponType.LASER,
        buildCost: 70,      // 建造成本（降低）
        maxLevel: 4,        // 只能升级3次（共4级）
        levels: [
            {
                level: 1,
                health: 250,
                damage: 10,
                range: 90,            // 1.5个格子（60 * 1.5 = 90）
                attackSpeed: 0.3,
                upgradeCost: 0,
                sellPrice: 35,
            },
            {
                level: 2,
                health: 300,
                damage: 12,
                range: 150,           // 2.5个格子（60 * 2.5 = 150）
                attackSpeed: 0.25,
                upgradeCost: 100,
                sellPrice: 70,
            },
            {
                level: 3,
                health: 360,
                damage: 15,
                range: 210,           // 3.5个格子（60 * 3.5 = 210）
                attackSpeed: 0.2,
                upgradeCost: 150,
                sellPrice: 105,
            },
            {
                level: 4,
                health: 432,
                damage: 19,
                range: 210,           // 3.5个格子（最后一次升级后保持）
                attackSpeed: 0.17,
                upgradeCost: 225,
                sellPrice: 140,
            },
        ],
    },
    [WeaponType.ROCKET]: {
        type: WeaponType.ROCKET,
        buildCost: 100,     // 建造成本（降低）
        maxLevel: 4,        // 只能升级3次（共4级）
        levels: [
            {
                level: 1,
                health: 400,
                damage: 45,
                range: 90,            // 1.5个格子（60 * 1.5 = 90）
                attackSpeed: 0.8,
                upgradeCost: 0,
                sellPrice: 50,
            },
            {
                level: 2,
                health: 480,
                damage: 54,
                range: 150,           // 2.5个格子（60 * 2.5 = 150）
                attackSpeed: 0.65,
                upgradeCost: 150,
                sellPrice: 100,
            },
            {
                level: 3,
                health: 576,
                damage: 65,
                range: 210,           // 3.5个格子（60 * 3.5 = 210）
                attackSpeed: 0.55,
                upgradeCost: 225,
                sellPrice: 150,
            },
            {
                level: 4,
                health: 691,
                damage: 78,
                range: 210,           // 3.5个格子（最后一次升级后保持）
                attackSpeed: 0.45,
                upgradeCost: 340,
                sellPrice: 200,
            },
        ],
    },
};

/**
 * 获取武器颜色
 * @param type 武器类型
 * @returns 武器颜色
 */
export function getWeaponColor(type: WeaponType): Color {
    return WEAPON_COLORS[type] || Color.RED;
}

/**
 * 获取指定等级配置
 * @param config 武器升级配置
 * @param level 等级（从1开始）
 * @returns 等级配置，如果不存在则返回null
 */
export function getWeaponLevelConfig(config: WeaponUpgradeConfig, level: number): WeaponLevelConfig | null {
    if (level < 1 || level > config.maxLevel) {
        return null;
    }
    return config.levels[level - 1] || null;
}

/**
 * 获取武器升级配置
 * @param type 武器类型
 * @returns 武器升级配置
 */
export function getWeaponUpgradeConfig(type: WeaponType): WeaponUpgradeConfig {
    return WEAPON_UPGRADE_CONFIGS[type] || WEAPON_UPGRADE_CONFIGS[WeaponType.BASIC];
}

/**
 * 获取武器建造成本
 * @param type 武器类型
 * @returns 建造成本
 */
export function getWeaponBuildCost(type: WeaponType): number {
    const config = getWeaponUpgradeConfig(type);
    return config.buildCost;
}

