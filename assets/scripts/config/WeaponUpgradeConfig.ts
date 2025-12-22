import { WeaponType } from '../constants/Index';

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
 * 武器升级配置表
 * 参考微信小游戏的配置
 */
export const WEAPON_UPGRADE_CONFIGS: Record<WeaponType, WeaponUpgradeConfig> = {
    [WeaponType.BASIC]: {
        type: WeaponType.BASIC,
        buildCost: 50,      // 建造成本
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 300,
                damage: 15,
                range: 450,
                attackSpeed: 0.9,
                upgradeCost: 0,      // 1级是初始等级，不需要升级成本
                sellPrice: 25,        // 出售1级武器获得25金币（基础成本的50%）
            },
            {
                level: 2,
                health: 360,
                damage: 18,
                range: 540,
                attackSpeed: 0.75,
                upgradeCost: 75,      // 从1级升级到2级需要75金币
                sellPrice: 50,        // 出售2级武器获得50金币
            },
            {
                level: 3,
                health: 432,
                damage: 22,
                range: 648,
                attackSpeed: 0.625,
                upgradeCost: 112,     // 从2级升级到3级需要112金币
                sellPrice: 75,        // 出售3级武器获得75金币
            },
            {
                level: 4,
                health: 518,
                damage: 26,
                range: 778,
                attackSpeed: 0.52,
                upgradeCost: 168,     // 从3级升级到4级需要168金币
                sellPrice: 100,       // 出售4级武器获得100金币
            },
            {
                level: 5,
                health: 622,
                damage: 31,
                range: 933,
                attackSpeed: 0.433,
                upgradeCost: 252,     // 从4级升级到5级需要252金币
                sellPrice: 125,       // 出售5级武器获得125金币
            },
        ],
    },
    [WeaponType.LASER]: {
        type: WeaponType.LASER,
        buildCost: 80,      // 建造成本
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 250,
                damage: 12,
                range: 500,
                attackSpeed: 0.35,
                upgradeCost: 0,
                sellPrice: 40,
            },
            {
                level: 2,
                health: 300,
                damage: 14,
                range: 600,
                attackSpeed: 0.29,
                upgradeCost: 120,
                sellPrice: 80,
            },
            {
                level: 3,
                health: 360,
                damage: 17,
                range: 720,
                attackSpeed: 0.24,
                upgradeCost: 180,
                sellPrice: 120,
            },
            {
                level: 4,
                health: 432,
                damage: 20,
                range: 864,
                attackSpeed: 0.20,
                upgradeCost: 270,
                sellPrice: 160,
            },
            {
                level: 5,
                health: 518,
                damage: 24,
                range: 1037,
                attackSpeed: 0.167,
                upgradeCost: 405,
                sellPrice: 200,
            },
        ],
    },
    [WeaponType.ROCKET]: {
        type: WeaponType.ROCKET,
        buildCost: 120,     // 建造成本
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 400,
                damage: 50,
                range: 550,
                attackSpeed: 0.7,
                upgradeCost: 0,
                sellPrice: 60,
            },
            {
                level: 2,
                health: 480,
                damage: 60,
                range: 660,
                attackSpeed: 0.583,
                upgradeCost: 180,
                sellPrice: 120,
            },
            {
                level: 3,
                health: 576,
                damage: 72,
                range: 792,
                attackSpeed: 0.486,
                upgradeCost: 270,
                sellPrice: 180,
            },
            {
                level: 4,
                health: 691,
                damage: 86,
                range: 950,
                attackSpeed: 0.405,
                upgradeCost: 405,
                sellPrice: 240,
            },
            {
                level: 5,
                health: 829,
                damage: 103,
                range: 1140,
                attackSpeed: 0.338,
                upgradeCost: 607,
                sellPrice: 300,
            },
        ],
    },
};

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

