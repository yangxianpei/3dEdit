import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper';
import { OBJLoader } from 'three-stdlib';
class MThree {
    scenes: Map<string, {
        scene: THREE.Scene,
        cameras: THREE.Camera[],
        objects: THREE.Object3D<THREE.Object3DEventMap>[],
    }>
    canvas?: HTMLCanvasElement;
    renderer: any;
    private id: number;
    activeId: number;
    selectedObject: any;

    controls?: TransformControls;
    Orbit?: OrbitControls;

    viewHelper: ViewHelper | null;
    helperRenderer?: THREE.WebGLRenderer;
    private currentCamera: null | THREE.Camera;
    private currentScene: null | THREE.Scene;
    private defalutView: THREE.Vector3 | null;
    tools: Set<string>;
    activeBox?: THREE.LineSegments<THREE.EdgesGeometry<THREE.BoxGeometry>, THREE.LineBasicMaterial, THREE.Object3DEventMap>;

    constructor(options: { id: string }) {
        const { id } = options || {}
        this.initCanvas(id)
        this.scenes = new Map()
        this.id = 1
        this.activeId = 1;
        this.selectedObject = null

        this.viewHelper = null
        this.mouseClick = this.mouseClick.bind(this)
        this.initEvent()
        this.currentCamera = null
        this.currentScene = null
        this.defalutView = null
        this.tools = new Set(["auxiliaryline", 'axesHelper', 'grid'])
    }
    private initCanvas(id: string) {
        const canvas = document.getElementById(id) as HTMLCanvasElement
        if (!canvas) {
            return
        }

        const parenatNode = canvas.parentElement?.getBoundingClientRect()
        if (!parenatNode) {
            return
        }
        this.canvas = canvas
        canvas.width = parenatNode.width
        canvas.height = parenatNode.height
        this.initThree()

    }
    private initThree() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

    }

    setActive() {
        const camera = this.getDefaultCamera()
        if (camera) {
            this.currentCamera = camera
        }
        const Scene = this.getActiveScene()
        if (Scene) {
            this.currentScene = Scene
            this.activeBox = Scene.children.find(item => item.name == 'activeBox') as any
            this.Orbit = Scene.userData?.Orbit
        }
    }
    private initEvent() {
        this.canvas?.addEventListener('click', this.mouseClick)
    }
    setSelectObject(object: any) {
        if (object) {
            const control = this.getActiveSceneControl()
            control?.detach()
            this.selectedObject = object
            const helper = object.userData?.helper
            const [size, center] = this.getMObjectMaxSize(helper ? helper : object)
            this.activeBox!.scale.copy(size)
            this.activeBox!.position.copy(center)
            this.activeBox!.visible = true
            control?.attach(object)
        }
    }


    private getMObjectMaxSize(object: THREE.Object3D<THREE.Object3DEventMap>) {

        if (object.children.length) {
            const boundingBox = new THREE.Box3();

            [...object.children, object].forEach(item => {
                boundingBox.expandByObject(item);
            })
            const center = new THREE.Vector3();
            const size = new THREE.Vector3()
            boundingBox.getSize(size);
            boundingBox.getCenter(center);
            return [size, center]
        } else {
            const special = ['lightCube']
            if (special.includes(object.name)) {
                object = object.userData.userData?.helper
            }
            const boundingBox = new THREE.Box3().setFromObject(object);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            boundingBox.getSize(size);
            boundingBox.getCenter(center);
            return [size, center]
        }

    }
    private mouseClick(event: { clientX: any; clientY: any; }) {
        const camera = this.getDefaultCamera()
        const objects = this.getActiveObject('objects')
        const control = this.getActiveSceneControl()
        if (!camera || !objects) {
            return
        }

        let x = event.clientX
        let y = event.clientY
        const raycaster = new THREE.Raycaster();
        const dd = this.canvas!.getBoundingClientRect()
        // 屏幕坐标转标准设备坐标
        const x1 = ((x - dd.left) / dd.width) * 2 - 1;
        const y1 = -((y - dd.top) / dd.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2().set(x1, y1), camera);
        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length) {
            const item = intersects[intersects.length - 1] as any
            this.selectedObject = item.object



            if (this.activeBox) {
                let target = item.object

                const [size, center] = this.getMObjectMaxSize(target)
                this.activeBox.scale.copy(size)
                this.activeBox.position.copy(center)
                this.activeBox.visible = true
            }


            const special = ['lightCube', 'cameraCube']
            if (special.includes(this.selectedObject.name)) {
                control?.attach(this.selectedObject.userData);
            } else {
                control?.attach(this.selectedObject);
            }

        } else {
            if (this.selectedObject) {
                if (this.activeBox) {
                    this.activeBox.visible = false
                }

                this.selectedObject = null
                control?.detach()
            }

        }
        this.render()
    }
    getActiveSenceCanOprObject() {
        const exludes = ['默认', "control", "activeBox", "grid", "axesHelper", 'auxiliaryline']
        const scene = this.getActiveObject('scene')
        return scene?.children.filter(item => !exludes.includes(item.name) && item.name.indexOf('auxiliaryline') == -1) || []

    }
    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080)
        const camera = this.createMasterCamera()
        camera.position.set(5, 5, 8);
        camera.lookAt(scene.position);
        scene.add(camera)
        this.createViewHelper(camera)
        this.createTransformControl(camera, scene)
        this.createOrbit(camera, scene)
        this.scenes.set(`${this.id}`, { scene, cameras: [camera], objects: [] })
        this.activeId = this.id
        this.id++
        this.setActive()
        // 添加指数雾效果
        // const fogColor = new THREE.Color(0xcccccc); // 雾的颜色
        // const density = 0.1; // 雾的浓度
        // scene.fog = new THREE.FogExp2(fogColor, density);

        this.createAcitiveBox(scene)
        return scene
    }
    createAcitiveBox(scene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(geometry);
        // 使用 LineBasicMaterial 创建线条材质
        const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
        // 创建线条几何体
        const line = new THREE.LineSegments(edges, material);
        line.name = 'activeBox'
        line.visible = false
        scene?.add(line)
        this.activeBox = line
    }
    createMasterCamera() {
        const camera = new THREE.PerspectiveCamera(
            75,
            this.canvas!.width / this.canvas!.height,
            0.01,
            1000
        );
        camera.name = '默认'
        return camera
    }
    setActiveId(id: number) {
        this.activeId = id
        const camera = this.getDefaultCamera()
        if (camera) {
            this.createViewHelper(camera)
        }
        this.setActive()

    }
    getActiveScene() {
        const d = this.scenes.get(`${this.activeId}`)
        if (d) {
            return d.scene
        }
    }
    getDefaultCamera() {
        const d = this.scenes.get(`${this.activeId}`)
        if (d && d.cameras?.length) {
            return d.cameras[0]
        }
    }
    getActiveObject<T extends "scene" | "cameras" | 'objects'>(type: T) {
        const d = this.scenes.get(`${this.activeId}`)
        if (d) {
            return d[type]
        }
        return null
    }
    getActiveSceneControl() {
        const scene = this.getActiveObject("scene")
        const control = scene?.children.find(item => item.name == 'control')
        return control as TransformControls
    }
    createBoxGeometry(scene: THREE.Scene) {
        const camera = this.getDefaultCamera()
        const objects = this.getActiveObject('objects')
        if (!camera || !objects) {
            return
        }
        const cube = new THREE.BoxGeometry(1, 1, 1);
        const metrial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
        });
        const mesh = new THREE.Mesh(cube, metrial);


        mesh.position.set(1, 0.5, 1)
        mesh.name = '立方体-' + mesh.uuid.slice(-4)
        scene.add(mesh);
        objects.push(mesh)

        return scene
    }
    setSenceViewAngle(type: "topview" | "rightview" | 'leftview' | "frontview" | "backview" | "upview" | 'defaultview') {
        const camera = this.getDefaultCamera()
        if (camera) {
            if (!this.defalutView) {
                this.defalutView = camera.position.clone()
            }

            switch (type) {
                case 'defaultview':
                    camera.position.copy(this.defalutView);
                    this.defalutView = null
                    break
                case 'topview':
                    camera.position.set(0, 10, 0);
                    break
                case 'rightview':
                    camera.position.set(10, 0, 0);
                    break
                case 'leftview':
                    camera.position.set(-10, 0, 0);
                    break
                case 'frontview':
                    camera.position.set(0, 0, 10);
                    break
                case 'backview':
                    camera.position.set(0, 0, -10);
                    break
                case 'upview':
                    camera.position.set(0, -10, 0);
                    break

            }
            if (type == "defaultview") {
                this.Orbit!.enabled = true
            } else {
                this.Orbit!.enabled = false
            }
            camera.lookAt(0, 0, 0); // 让相机朝向场景中心
        }
    }
    createViewHelper(camera: THREE.Camera) {

        this.renderer.autoClear = false;
        const helpCanvas = document.getElementById('helpCanvas') as HTMLElement;
        const helperRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: helpCanvas });
        helperRenderer.setSize(helpCanvas.parentElement!.offsetWidth, helpCanvas.parentElement!.offsetHeight);

        this.viewHelper = new ViewHelper(camera, helperRenderer.domElement);
        this.viewHelper.setLabels('x', 'y', 'z')
        this.viewHelper.position.set(0.5, -0.5, 0.5)
        this.viewHelper.animating = false
        this.helperRenderer = helperRenderer
        const clock = new THREE.Clock();
        helperRenderer.domElement.addEventListener('pointerdown', (event) => {
            const delta = clock.getDelta();
            this.viewHelper!.handleClick(event);
            this.viewHelper!.update(delta);

        });
    }
    createTransformControl(camera: THREE.Camera, scene: THREE.Scene) {
        const controls = new TransformControls(camera, this.renderer.domElement);
        // controls.showX = true;
        // controls.showY = true;
        // controls.showZ = false;
        controls.addEventListener('dragging-changed', (event) => {
            if (!this.defalutView) {

                this.Orbit!.enabled = !event.value;
                if (event.value) {
                    if (this.selectedObject) {
                        this.activeBox!.visible = false
                    }
                }
            }

        });

        controls.setMode('translate');
        controls.name = 'control'

        scene.add(controls)
        return
    }
    createOrbit(camera: THREE.Camera, scene: THREE.Scene) {

        const Orbit = new OrbitControls(camera, this.renderer.domElement);
        // controls.enabled = false; // 禁用拖拽控制
        this.Orbit = Orbit
        Orbit.enableDamping = true; // 启用拖拽惯性效果

        scene.userData = {
            Orbit
        }
    }
    createHelper(scene: THREE.Scene) {
        const grounp = new THREE.Group()
        //开启网格
        const gridHelper = new THREE.GridHelper(15, 15, '0x000000', '0x000000');
        // 创建网格平面的材质
        const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
        const gridGeometry = new THREE.PlaneGeometry(15, 15);

        // 创建填充颜色的平面
        const gridPlane = new THREE.Mesh(gridGeometry, gridMaterial);
        gridPlane.rotation.x = -Math.PI / 2; // 将平面旋转到水平方向
        grounp.name = 'grid'
        grounp.add(gridPlane);
        grounp.add(gridHelper)
        const axesHelper = new THREE.AxesHelper(5); // 5是轴的长度
        axesHelper.setColors(0xff0000, 0x00ff00, 0x0000ff)
        axesHelper.name = 'axesHelper'
        scene.add(grounp);
        scene.add(axesHelper);

    }
    switchCamera(idx: number) {
        const cameras = this.getActiveObject('cameras')
        const scene = this.getActiveObject("scene")
        const controls = this.getActiveSceneControl()
        const activeCamera = cameras?.[idx]
        if (activeCamera) {
            this.currentCamera = activeCamera
            this.createOrbit(activeCamera, scene as THREE.Scene)
            controls.visible = false
        }
    }
    setObjectVisible(name: string) {
        const scene = this.getActiveObject("scene")
        const controls = this.getActiveSceneControl()
        if (scene) {
            if (this.tools.has(name)) {
                this.tools.delete(name)
            } else {
                this.tools.add(name)
            }

            scene.children.forEach(object => {
                if (object.name.indexOf(name) > -1) {
                    object.visible = !object.visible
                    if (object.visible) {
                        this.tools.add(name)
                    } else {
                        this.tools.delete(name)
                    }


                }
            });
            controls.visible = false

        }
    }
    addLights(type: number) {
        if (type == 0) {

            const objects = this.getActiveObject('objects')
            const scene = this.getActiveScene()
            const control = this.getActiveSceneControl()

            const geometry = new THREE.SphereGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false });
            const lightCube = new THREE.Mesh(geometry, material);
            lightCube.name = 'lightCube';
            const pointLight = new THREE.PointLight(0xffffff, 1, 100);
            pointLight.name = '点光-' + pointLight.uuid.slice(-4)

            scene?.add(pointLight)
            const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
            pointLightHelper.name = 'auxiliaryline-light'
            pointLightHelper?.add(lightCube);
            scene?.add(pointLightHelper)

            pointLight.position.set(1, 3, 1)
            pointLight.userData = {
                updateActiveBox: () => {
                    this.activeBox!.visible = false
                },
                helper: pointLightHelper
            }
            lightCube.userData = pointLight
            objects?.push(lightCube)
            control?.attach(pointLight);

        }

    }

    addCamera() {

        const scene = this.getActiveObject("scene")
        const objects = this.getActiveObject("objects")
        const cameras = this.getActiveObject("cameras")
        const control = this.getActiveSceneControl()

        const camera = new THREE.PerspectiveCamera(
            48, // 视场角度 (FOV)
            20 / 10, // 宽高比
            2, // 近剪切面
            10 // 远剪切面
        );
        camera.position.set(1, 2, 5);
        camera.name = '相机' + camera.uuid.slice(-4)
        scene?.add(camera)
        const geometry = new THREE.SphereGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false });
        const cameraCube = new THREE.Mesh(geometry, material);
        cameraCube.name = 'cameraCube';
        const cameraHelper = new THREE.CameraHelper(camera);
        cameraHelper.add(cameraCube)
        cameraHelper.name = 'auxiliaryline-camera';
        cameraCube.userData = camera
        scene?.add(cameraHelper)
        // group.userData = camera
        objects?.push(cameraCube)
        scene?.add(cameraHelper)
        cameras?.push(camera)
        control?.attach(camera);
    }
    removeObject3D(object: THREE.Object3D<THREE.Object3DEventMap>) {
        if (!object) return
        const scene = this.getActiveObject('scene')
        const objects = this.getActiveObject("objects")
        const controls = this.getActiveSceneControl()

        if (scene) {
            if (object.userData?.helper) {
                object.parent!.userData?.helper.remove(object.userData?.helper)
            }
            const t = object.parent!.remove(object)
            if (t instanceof THREE.Mesh) {
                t.geometry.dispose();
                t.material.dispose();
            }

            if (objects) {
                const idx = objects.findIndex(item => item.uuid == object?.uuid)
                if (idx > -1) {
                    objects.splice(idx, 1)
                }

            }
        }
        this.activeBox!.visible = false
        controls.visible = false




    }


    loadModel() {
        const scene = this.getActiveScene()
        const objects = this.getActiveObject('objects')
        const loader = new OBJLoader();
        if (scene) {
            loader.load(
                '/Tree1.obj', // 替换为你的OBJ模型文件路径
                function (object) {
                    object.scale.set(0.1, 0.1, 0.1)
                    scene.add(object);
                    objects?.push(object)
                }
            );
        }

    }
    render() {
        if (this.currentScene && this.currentCamera) {
            const ani = () => {
                this.renderer.render(this.currentScene, this.currentCamera);
                this.viewHelper?.render(this.helperRenderer as THREE.WebGLRenderer)
                requestAnimationFrame(() => ani());

            };
            ani()
        }

    }


}

export default MThree

