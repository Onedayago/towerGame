
// ==================== 游戏基础尺寸 ====================
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 480;

const CELL_COUNT_Y = 8;

const CELL_SIZE = Math.floor(GAME_HEIGHT / CELL_COUNT_Y);

const CELL_COUNT_X = Math.floor(GAME_WIDTH / CELL_SIZE);

export {
    // 游戏基础尺寸
    CELL_SIZE,
    GAME_WIDTH,
    GAME_HEIGHT,
    CELL_COUNT_X,
    CELL_COUNT_Y,
};

