/**
 * 波次系统配置
 */
export class WaveConfig {
    /** 每波持续时间（毫秒） */
    static WAVE_DURATION = 20000;
    
    /** 每波增加的血量倍数（线性增长，更平滑） */
    static HP_BONUS_PER_WAVE = 0.15;  // 每波增加15%血量，而非1.5倍（降低难度曲线）
    
    /** 每波增加的移动速度倍数（线性增长） */
    static SPEED_BONUS_PER_WAVE = 0.08;  // 每波增加8%移动速度
    
    /** 每波生成间隔递减率（更平滑的难度增长） */
    static SPAWN_INTERVAL_REDUCTION = 0.97;  // 每波减少3%间隔，更平滑
    
    /** 最小生成间隔（秒） */
    static MIN_SPAWN_INTERVAL = 0.8;  // 提高最小值，避免后期过快
    
    /** 总波次数（0 表示无限波次） */
    static TOTAL_WAVES = 20;  // 增加波次，延长游戏时间
    
    /** 每波基础敌人数 */
    static BASE_ENEMIES_PER_WAVE = 10;  // 降低基础数量
    
    /** 每波敌人数增长量（每波增加的敌人数） */
    static ENEMIES_INCREASE_PER_WAVE = 2;  // 每波增加2个敌人，渐进增长
    
    /**
     * 获取指定波次的敌人数
     * @param waveLevel 波次等级（从1开始）
     * @returns 该波次的敌人数
     */
    static getEnemiesPerWave(waveLevel: number): number {
        return this.BASE_ENEMIES_PER_WAVE + (waveLevel - 1) * this.ENEMIES_INCREASE_PER_WAVE;
    }
}

