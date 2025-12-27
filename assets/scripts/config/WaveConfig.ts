/**
 * 波次系统配置
 */
export class WaveConfig {
    /** 每波持续时间（毫秒） */
    static WAVE_DURATION = 20000;
    
    /** 每波增加的血量倍数（更平滑的难度增长） */
    static HP_BONUS_PER_WAVE = 1.5;
    
    /** 每波生成间隔递减率（更平滑的难度增长） */
    static SPAWN_INTERVAL_REDUCTION = 0.95;
    
    /** 最小生成间隔（秒） */
    static MIN_SPAWN_INTERVAL = 0.5;
    
    /** 总波次数（0 表示无限波次） */
    static TOTAL_WAVES = 10;
    
    /** 每波基础敌人数 */
    static BASE_ENEMIES_PER_WAVE = 15;
    
    /** 每波敌人数增长量（每波增加的敌人数） */
    static ENEMIES_INCREASE_PER_WAVE = 0;
    
    /**
     * 获取指定波次的敌人数
     * @param waveLevel 波次等级（从1开始）
     * @returns 该波次的敌人数
     */
    static getEnemiesPerWave(waveLevel: number): number {
        return this.BASE_ENEMIES_PER_WAVE + (waveLevel - 1) * this.ENEMIES_INCREASE_PER_WAVE;
    }
}

