import { _decorator, Component, Label } from 'cc';
import { WaveManager } from '../../../managers/Index';
import { WaveToast } from './WaveToast';
const { ccclass, property } = _decorator;

/**
 * 波次显示组件
 * 显示当前波次和敌人进度，参考原游戏的设计
 * 控制 WaveToast 的展示
 */
@ccclass('WaveView')
export class WaveView extends Component {
    
    private waveManager: WaveManager | null = null;
    
    // 组件引用（通过编辑器绑定）
    @property({ type: Label, displayName: '波次标签' })
    private waveLabel: Label | null = null;
    
    @property({ type: Label, displayName: '进度标签' })
    private progressLabel: Label | null = null;

    @property({ type: WaveToast, displayName: '波次 Toast', tooltip: '波次提示 Toast 组件' })
    private waveToast: WaveToast | null = null;
    
    private lastWaveLevel: number = -1;
    private lastProgress: { current: number; max: number } | null = null;
    
    onLoad() {
        // 获取波次管理器（不初始化，由 EnemyManager 负责初始化）
        this.waveManager = WaveManager.getInstance();
    }
    
    start() {
        // 初始化显示状态
        if (this.waveManager) {
            this.lastWaveLevel = this.waveManager.getWaveLevel();
            this.lastProgress = this.waveManager.getWaveProgress();
        }
        // 更新显示
        this.updateWaveDisplay();
    }
    
    update(deltaTime: number) {
        // 只在波次或进度变化时更新显示
        if (this.waveManager) {
            const currentWave = this.waveManager.getWaveLevel();
            const currentProgress = this.waveManager.getWaveProgress();
            
            // 检查波次变化并显示 Toast
            if (currentWave !== this.lastWaveLevel && currentWave > 0) {
                this.showWaveToast(currentWave);
            }
            
            if (currentWave !== this.lastWaveLevel || 
                !this.lastProgress || 
                currentProgress.current !== this.lastProgress.current ||
                currentProgress.max !== this.lastProgress.max) {
                this.updateWaveDisplay();
                this.lastWaveLevel = currentWave;
                this.lastProgress = { ...currentProgress };
            }
        }
    }
    
    /**
     * 更新波次显示
     */
    private updateWaveDisplay() {
        if (!this.waveManager) return;
        
        const waveLevel = this.waveManager.getWaveLevel();
        const progress = this.waveManager.getWaveProgress();
        
        // 更新波次标签（确保至少显示波次 1）
        if (this.waveLabel) {
            const displayWave = waveLevel;
            this.waveLabel.string = `波次 ${displayWave}`;
        }
        
        // 更新进度标签
        if (this.progressLabel) {
            this.progressLabel.string = `${progress.current}/${progress.max}`;
        }
    }
    
    /**
     * 获取当前波次（供外部调用）
     */
    public getCurrentWave(): number {
        return this.waveManager?.getWaveLevel() || 0;
    }
    
    /**
     * 获取当前进度（供外部调用）
     */
    public getCurrentProgress(): { current: number; max: number } {
        return this.waveManager?.getWaveProgress() || { current: 0, max: 0 };
    }

    /**
     * 显示波次 Toast
     * @param waveNumber 波次编号
     */
    private showWaveToast(waveNumber: number) {
        if (this.waveToast) {
            this.waveToast.showWave(waveNumber);
        }
    }
}

