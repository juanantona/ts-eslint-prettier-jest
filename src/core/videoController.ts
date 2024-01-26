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
	private frecuency: number = 1000;
	private startProcessId: NodeJS.Timeout;

	constructor(videoRecorder: VideoRecorder, motionSensor: MotionSensor) {
		this.videoRecorder = videoRecorder;
		this.motionSensor = motionSensor;
	}

	recordMotion() {
		try {
			this.motionSensor.isDetectingMotion() ? this.videoRecorder.startRecording() : this.videoRecorder.stopRecording();
		} catch {
			this.videoRecorder.stopRecording();
		}
	}

	start() {
		this.startProcessId = setInterval(this.recordMotion.bind(this), this.frecuency);
	}

	stop() {
		clearInterval(this.startProcessId);
	}
}
