export interface MotionSensor {
	isDetectingMotion(): boolean;
}

export interface VideoRecorder {
	startRecording(): void;
	stopRecording(): void;
}

export class VideoController {
	private videoRecorder: VideoRecorder;
	private motionSensor: MotionSensor;
	private thereIsMovement: boolean;
	private frecuency: number = 1000;
	private startProcessId: NodeJS.Timeout;

	constructor(videoRecorder: VideoRecorder, motionSensor: MotionSensor) {
		this.videoRecorder = videoRecorder;
		this.motionSensor = motionSensor;
	}

	checkSensor() {
		try {
			this.thereIsMovement = this.motionSensor.isDetectingMotion();
		} catch {
			this.videoRecorder.stopRecording();
		}
	}

	operateVideoRecording() {
		if (this.thereIsMovement) {
			this.videoRecorder.startRecording();
		} else {
			this.videoRecorder.stopRecording();
		}
	}

	start() {
		function callback() {
			this.checkSensor();
			this.operateVideoRecording();
		}
		this.startProcessId = setInterval(callback.bind(this), this.frecuency);
	}

	stop() {
		clearInterval(this.startProcessId);
	}
}
