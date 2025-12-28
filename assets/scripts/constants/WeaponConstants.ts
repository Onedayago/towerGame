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
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 300,
                damage: 18,           // 提高伤害（18，之前15）
                range: 320,           // 略微提高范围
                attackSpeed: 0.85,    // 略微提高攻击速度
                upgradeCost: 0,       // 1级是初始等级，不需要升级成本
                sellPrice: 20,        // 出售1级武器获得20金币（基础成本的50%）
            },
            {
                level: 2,
                health: 360,
                damage: 22,           // 伤害：22（之前18）
                range: 380,
                attackSpeed: 0.7,     // 攻击速度：0.7（之前0.75）
                upgradeCost: 60,      // 从1级升级到2级需要60金币（降低）
                sellPrice: 40,        // 出售2级武器获得40金币
            },
            {
                level: 3,
                health: 432,
                damage: 27,           // 伤害：27（之前22）
                range: 455,
                attackSpeed: 0.6,     // 攻击速度：0.6（之前0.625）
                upgradeCost: 90,      // 从2级升级到3级需要90金币（降低）
                sellPrice: 60,        // 出售3级武器获得60金币
            },
            {
                level: 4,
                health: 518,
                damage: 33,           // 伤害：33（之前26）
                range: 545,
                attackSpeed: 0.5,     // 攻击速度：0.5（之前0.52）
                upgradeCost: 135,     // 从3级升级到4级需要135金币（降低）
                sellPrice: 85,        // 出售4级武器获得85金币
            },
            {
                level: 5,
                health: 622,
                damage: 40,           // 伤害：40（之前31）
                range: 655,
                attackSpeed: 0.42,    // 攻击速度：0.42（之前0.433）
                upgradeCost: 200,     // 从4级升级到5级需要200金币（降低）
                sellPrice: 110,       // 出售5级武器获得110金币
            },
        ],
    },
    [WeaponType.LASER]: {
        type: WeaponType.LASER,
        buildCost: 70,      // 建造成本（降低）
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 250,
                damage: 10,           // 伤害：10（降低，保持高攻速特色）
                range: 360,           // 略微提高范围
                attackSpeed: 0.3,     // 攻击速度：0.3（更快，之前0.35）
                upgradeCost: 0,
                sellPrice: 35,        // 出售1级武器获得35金币
            },
            {
                level: 2,
                health: 300,
                damage: 12,           // 伤害：12（之前14）
                range: 430,
                attackSpeed: 0.25,    // 攻击速度：0.25（更快，之前0.29）
                upgradeCost: 100,     // 从1级升级到2级需要100金币（降低）
                sellPrice: 70,        // 出售2级武器获得70金币
            },
            {
                level: 3,
                health: 360,
                damage: 15,           // 伤害：15（之前17）
                range: 515,
                attackSpeed: 0.2,     // 攻击速度：0.2（更快，之前0.24）
                upgradeCost: 150,     // 从2级升级到3级需要150金币（降低）
                sellPrice: 105,       // 出售3级武器获得105金币
            },
            {
                level: 4,
                health: 432,
                damage: 19,           // 伤害：19（之前20）
                range: 620,
                attackSpeed: 0.17,    // 攻击速度：0.17（更快，之前0.20）
                upgradeCost: 225,     // 从3级升级到4级需要225金币（降低）
                sellPrice: 140,       // 出售4级武器获得140金币
            },
            {
                level: 5,
                health: 518,
                damage: 24,           // 伤害：24（保持不变）
                range: 745,
                attackSpeed: 0.14,    // 攻击速度：0.14（更快，之前0.167）
                upgradeCost: 340,     // 从4级升级到5级需要340金币（降低）
                sellPrice: 175,       // 出售5级武器获得175金币
            },
        ],
    },
    [WeaponType.ROCKET]: {
        type: WeaponType.ROCKET,
        buildCost: 100,     // 建造成本（降低）
        maxLevel: 5,
        levels: [
            {
                level: 1,
                health: 400,
                damage: 45,           // 伤害：45（降低，之前50，保持高伤害特色但更平衡）
                range: 390,           // 略微提高范围
                attackSpeed: 0.8,     // 攻击速度：0.8（降低，之前0.7，增加攻击间隔）
                upgradeCost: 0,
                sellPrice: 50,        // 出售1级武器获得50金币
            },
            {
                level: 2,
                health: 480,
                damage: 54,           // 伤害：54（之前60）
                range: 470,
                attackSpeed: 0.65,    // 攻击速度：0.65（之前0.583）
                upgradeCost: 150,     // 从1级升级到2级需要150金币（降低）
                sellPrice: 100,       // 出售2级武器获得100金币
            },
            {
                level: 3,
                health: 576,
                damage: 65,           // 伤害：65（之前72）
                range: 565,
                attackSpeed: 0.55,    // 攻击速度：0.55（之前0.486）
                upgradeCost: 225,     // 从2级升级到3级需要225金币（降低）
                sellPrice: 150,       // 出售3级武器获得150金币
            },
            {
                level: 4,
                health: 691,
                damage: 78,           // 伤害：78（之前86）
                range: 680,
                attackSpeed: 0.45,    // 攻击速度：0.45（之前0.405）
                upgradeCost: 340,     // 从3级升级到4级需要340金币（降低）
                sellPrice: 200,       // 出售4级武器获得200金币
            },
            {
                level: 5,
                health: 829,
                damage: 94,           // 伤害：94（之前103）
                range: 815,
                attackSpeed: 0.38,    // 攻击速度：0.38（之前0.338）
                upgradeCost: 510,     // 从4级升级到5级需要510金币（降低）
                sellPrice: 250,       // 出售5级武器获得250金币
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

