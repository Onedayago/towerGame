/**
 * 武器常量配置
 * 定义各种武器的属性配置
 */

/**
 * 武器类型枚举
 */
export enum WeaponType {
    BASIC = 'basic',       // 基础武器
    RAPID = 'rapid',      // 快速武器
    HEAVY = 'heavy',      // 重型武器
    SNIPER = 'sniper'     // 狙击武器
}

/**
 * 武器配置接口
 */
export interface WeaponConfig {
    type: WeaponType;
    attackSpeed: number;   // 攻击速度（攻击间隔，秒）
    damage: number;        // 攻击力
    range: number;         // 攻击范围（像素）
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
        range: 200,
        cost: 50
    },
    [WeaponType.RAPID]: {
        type: WeaponType.RAPID,
        attackSpeed: 0.5,   // 每秒攻击2次
        damage: 10,
        range: 150,
        cost: 75
    },
    [WeaponType.HEAVY]: {
        type: WeaponType.HEAVY,
        attackSpeed: 2.0,   // 每2秒攻击1次
        damage: 30,
        range: 250,
        cost: 100
    },
    [WeaponType.SNIPER]: {
        type: WeaponType.SNIPER,
        attackSpeed: 1.5,   // 每1.5秒攻击1次
        damage: 50,
        range: 400,
        cost: 150
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

