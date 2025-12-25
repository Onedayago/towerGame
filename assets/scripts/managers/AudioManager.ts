import { AudioSource, AudioClip, director, Node } from 'cc';

/**
 * 音频管理器
 * 管理背景音乐和音效播放
 * 参考原游戏实现
 */
export class AudioManager {
    private static instance: AudioManager | null = null;
    
    // 音频路径配置（需要在编辑器中设置）
    private bgMusicClip: AudioClip | null = null;
    private boomSoundClip: AudioClip | null = null;
    
    // 背景音乐音频源
    private bgMusicSource: AudioSource | null = null;
    
    // 音效池：用于播放多个同时发生的音效
    private sfxPool: AudioSource[] = [];
    private readonly SFX_POOL_INIT_SIZE = 4;
    private readonly SFX_POOL_MAX_SIZE = 16;
    
    // 音量控制
    private musicVolume: number = 1.0;
    private sfxVolume: number = 1.0;
    private musicMuted: boolean = false;
    private sfxMuted: boolean = false;
    
    // 音频管理器节点引用
    private audioManagerNode: Node | null = null;
    private sfxPoolInitialized: boolean = false;
    
    private constructor() {
        // 延迟初始化音效池，等到场景准备好
    }
    
    /**
     * 获取单例实例
     */
    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }
    
    /**
     * 设置音频管理器节点（由外部调用，传入一个可以添加组件的节点）
     * @param node 用于管理音频的节点
     */
    setAudioNode(node: Node) {
        if (node && node.isValid) {
            this.audioManagerNode = node;
        }
    }
    
    /**
     * 确保音频管理器节点存在
     */
    private ensureAudioManagerNode(): Node | null {
        if (this.audioManagerNode && this.audioManagerNode.isValid) {
            return this.audioManagerNode;
        }
        
        // 如果还没有设置节点，尝试从场景中查找一个可用的节点
        const scene = director.getScene();
        if (!scene) {
            return null;
        }
        
        // 查找音频管理器节点
        let audioNode = scene.getChildByName('AudioManager');
        if (!audioNode) {
            // 如果不存在，查找 WarView 节点（通常存在且可以添加组件）
            audioNode = scene.getChildByName('WarView') || scene.getChildByPath('Canvas/WarView');
        }
        
        if (audioNode && audioNode.isValid) {
            this.audioManagerNode = audioNode;
            return audioNode;
        }
        
        return null;
    }
    
    /**
     * 初始化音效池（延迟初始化）
     */
    private initSfxPool() {
        if (this.sfxPoolInitialized) {
            return;
        }
        
        const audioNode = this.ensureAudioManagerNode();
        if (!audioNode) {
            console.warn('AudioManager: 场景未准备好，无法初始化音效池');
            return;
        }
        
        // 使用场景节点本身来创建音频源，避免创建子节点
        for (let i = 0; i < this.SFX_POOL_INIT_SIZE; i++) {
            const audioSource = this.createAudioSource();
            if (audioSource) {
                this.sfxPool.push(audioSource);
            }
        }
        
        this.sfxPoolInitialized = true;
    }
    
    /**
     * 创建音频源
     */
    private createAudioSource(): AudioSource | null {
        const audioNode = this.ensureAudioManagerNode();
        if (!audioNode) {
            return null;
        }
        
        // 直接在音频管理器节点上添加多个 AudioSource 组件
        // 注意：每个节点可以有多个 AudioSource 组件
        const audioSource = audioNode.addComponent(AudioSource);
        audioSource.volume = this.sfxVolume;
        return audioSource;
    }
    
    /**
     * 从池中获取一个可用的音频源
     */
    private getAvailableAudioSource(): AudioSource | null {
        // 延迟初始化音效池
        if (!this.sfxPoolInitialized) {
            this.initSfxPool();
        }
        
        // 查找未在播放的音频源
        for (const source of this.sfxPool) {
            if (source && source.isValid && !source.playing) {
                return source;
            }
        }
        
        // 如果所有音频源都在播放，且池未满，创建新的
        if (this.sfxPool.length < this.SFX_POOL_MAX_SIZE) {
            const newSource = this.createAudioSource();
            if (newSource) {
                this.sfxPool.push(newSource);
                return newSource;
            }
        }
        
        // 池已满，返回 null（不播放音效）
        return null;
    }
    
    /**
     * 设置背景音乐音频剪辑
     * @param clip 音频剪辑
     */
    setBackgroundMusic(clip: AudioClip) {
        this.bgMusicClip = clip;
        
        // 如果还没有创建背景音乐音频源，创建一个
        if (!this.bgMusicSource) {
            const audioNode = this.ensureAudioManagerNode();
            if (!audioNode) return;
            
            // 直接在音频管理器节点上添加 AudioSource 组件
            this.bgMusicSource = audioNode.getComponent(AudioSource);
            if (!this.bgMusicSource) {
                this.bgMusicSource = audioNode.addComponent(AudioSource);
            }
            this.bgMusicSource.loop = true;
            this.bgMusicSource.volume = this.musicVolume;
        }
        
        if (this.bgMusicSource) {
            this.bgMusicSource.clip = clip;
        }
    }
    
    /**
     * 设置爆炸音效音频剪辑
     * @param clip 音频剪辑
     */
    setBoomSound(clip: AudioClip) {
        this.boomSoundClip = clip;
    }
    
    /**
     * 初始化背景音乐
     */
    initBackgroundMusic() {
        if (!this.bgMusicSource && this.bgMusicClip) {
            const audioNode = this.ensureAudioManagerNode();
            if (!audioNode) return;
            
            // 直接在音频管理器节点上添加 AudioSource 组件
            this.bgMusicSource = audioNode.getComponent(AudioSource);
            if (!this.bgMusicSource) {
                this.bgMusicSource = audioNode.addComponent(AudioSource);
            }
            this.bgMusicSource.clip = this.bgMusicClip;
            this.bgMusicSource.loop = true;
            this.bgMusicSource.volume = this.musicVolume;
        }
    }
    
    /**
     * 播放背景音乐
     */
    playBackgroundMusic() {
        if (!this.bgMusicSource || !this.bgMusicClip) {
            this.initBackgroundMusic();
        }
        
        if (this.bgMusicSource && !this.musicMuted) {
            if (!this.bgMusicSource.playing) {
                this.bgMusicSource.play();
            }
        }
    }
    
    /**
     * 暂停背景音乐
     */
    pauseBackgroundMusic() {
        if (this.bgMusicSource && this.bgMusicSource.playing) {
            this.bgMusicSource.pause();
        }
    }
    
    /**
     * 停止背景音乐
     */
    stopBackgroundMusic() {
        if (this.bgMusicSource) {
            this.bgMusicSource.stop();
        }
    }
    
    /**
     * 恢复背景音乐
     */
    resumeBackgroundMusic() {
        if (this.bgMusicSource && !this.musicMuted) {
            if (this.bgMusicSource.playing) {
                // 如果正在播放，不需要操作
                return;
            }
            this.bgMusicSource.play();
        }
    }
    
    /**
     * 播放爆炸音效
     */
    playBoomSound() {
        if (this.sfxMuted || !this.boomSoundClip) {
            return;
        }
        
        const audioSource = this.getAvailableAudioSource();
        if (audioSource) {
            audioSource.clip = this.boomSoundClip;
            audioSource.volume = this.sfxVolume;
            audioSource.playOneShot(this.boomSoundClip, this.sfxVolume);
        }
    }
    
    /**
     * 设置背景音乐音量
     * @param volume 音量值 (0.0 - 1.0)
     */
    setMusicVolume(volume: number) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.bgMusicSource) {
            this.bgMusicSource.volume = this.musicVolume;
        }
    }
    
    /**
     * 设置音效音量
     * @param volume 音量值 (0.0 - 1.0)
     */
    setSfxVolume(volume: number) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        // 更新所有音效池中的音频源音量
        this.sfxPool.forEach(source => {
            source.volume = this.sfxVolume;
        });
    }
    
    /**
     * 静音/取消静音背景音乐
     * @param muted 是否静音
     */
    setMusicMuted(muted: boolean) {
        this.musicMuted = muted;
        if (muted) {
            this.pauseBackgroundMusic();
        } else {
            this.resumeBackgroundMusic();
        }
    }
    
    /**
     * 静音/取消静音音效
     * @param muted 是否静音
     */
    setSfxMuted(muted: boolean) {
        this.sfxMuted = muted;
    }
    
    /**
     * 获取背景音乐音量
     */
    getMusicVolume(): number {
        return this.musicVolume;
    }
    
    /**
     * 获取音效音量
     */
    getSfxVolume(): number {
        return this.sfxVolume;
    }
    
    /**
     * 检查背景音乐是否静音
     */
    isMusicMuted(): boolean {
        return this.musicMuted;
    }
    
    /**
     * 检查音效是否静音
     */
    isSfxMuted(): boolean {
        return this.sfxMuted;
    }
    
    /**
     * 销毁音频管理器，释放资源
     */
    destroy() {
        if (this.bgMusicSource) {
            this.bgMusicSource.stop();
            this.bgMusicSource = null;
        }
        
        // 停止所有音效
        this.sfxPool.forEach(source => {
            source.stop();
        });
        this.sfxPool = [];
        
        AudioManager.instance = null;
    }
}

