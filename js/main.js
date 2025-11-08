import { Router } from "./router.js";
import { MenuScene } from "./scenes/menu.scene.js";
import { DifficultyScene } from "./scenes/difficulty.scene.js";
import { GameScene } from "./scenes/game.scene.js";

const root = document.getElementById("app");
Router.mount(root);

// ลงทะเบียนซีน
Router.register("menu", MenuScene);
Router.register("difficulty", DifficultyScene);
Router.register("game", GameScene);

// เริ่มที่เมนู
Router.go("menu");