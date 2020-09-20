import * as THREE from "three";

// ページの読み込みを待つ
window.addEventListener("load", init);

function init() {
  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  document.body.append(canvas);

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // レンダラー側で影を有効に
  renderer.shadowMap.enabled = true;

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.OrthographicCamera(
    -width / 2,
    +width / 2,
    height / 2,
    -height / 2
  );

  // 光源を作成
  {
    const spotLight = new THREE.SpotLight(
      0xffffff,
      4,
      10000,
      Math.PI / 5,
      0.2,
      1.5
    );
    spotLight.position.set(500, 300, 500);
    spotLight.castShadow = true; // 影を落とす設定
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);
  }

  // 地面を作成
  {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({
        roughness: 0.0,
        metalness: 0.6,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true; // 影の設定
    scene.add(floor);
  }

  // マス目を作成
  {
    // 立方体のマテリアルとジオメトリを作成
    const material = new THREE.MeshStandardMaterial({
      color: 0x33FF44,
      roughness: 0.1,
      metalness: 0.2,
    });
    const geometry = new THREE.BoxGeometry(45, 45, 45);

    const BLOCK_NUM = 20;
    const blocks = [];
    for (let i = 0; i < BLOCK_NUM; i++) {
      blocks[i] = [];
      for (let j = 0; j < BLOCK_NUM; j++) {
        blocks[i][j] = 0;
      }
    }

    // 立方体を複数作成しランダムに配置
    for (let i = 0; i < 500; i++) {
      const box = new THREE.Mesh(geometry, material);

      const blockX = Math.floor(Math.random() * BLOCK_NUM);
      const blockZ = Math.floor(Math.random() * BLOCK_NUM);
      const blockY = blocks[blockX][blockZ]++;
      // const blockX = 10;
      // const blockZ = 10;
      // const blockY = 0;

      box.position.x = (blockX - BLOCK_NUM / 2) * 50 + 25;
      box.position.y = blockY * 50 + 25;
      box.position.z = (blockZ - BLOCK_NUM / 2) * 50 + 25;

      // 影の設定
      box.receiveShadow = true;
      box.castShadow = true;
      scene.add(box);
    }
  }

  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    // 角度に応じてカメラの位置を設定
    camera.position.x = 500 * Math.sin(Date.now() / 2000);
    camera.position.y = 250;
    camera.position.z = 500 * Math.cos(Date.now() / 2000);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
}
