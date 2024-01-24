import { MotionSensor, VideoRecorder } from './videoController';

class VideoRecorderSpy implements VideoRecorder {
	public isRecording: boolean;
	startRecording(): void {
		this.isRecording = true;
	}
	stopRecording(): void {
		this.isRecording = false;
	}
}

describe('When the sensor works as expected', () => {
	class MotionSensorStub implements MotionSensor {
		constructor(private stubMotion: boolean) {}
		isDetectingMotion(): boolean {
			return this.stubMotion;
		}
	}
	describe('When the sensor detects movement', () => {
		it('Should start recording', async () => {
			const { VideoController } = await import('./videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.checkSensor();
			videoController.operateVideoRecording();

			expect(videoRecorder.isRecording).toBe(true);
		});
	});

	describe("When the sensor doesn't detect movement", () => {
		it('Should stop recording', async () => {
			const { VideoController } = await import('./videoController');
			const motionSensor = new MotionSensorStub(false);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.checkSensor();
			videoController.operateVideoRecording();

			expect(videoRecorder.isRecording).toBe(false);
		});
	});

	describe('When the controller start to work', () => {
		it("Should start recording is sensor doesn't detect movement after a second", async () => {
			jest.useFakeTimers();
			const { VideoController } = await import('./videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.start();
			expect(videoRecorder.isRecording).toBe(undefined);
			jest.advanceTimersByTime(1000);
			expect(videoRecorder.isRecording).toBe(true);
		});

		it('Should check sensor every second', async () => {
			jest.useFakeTimers();
			const { VideoController } = await import('./videoController');
			const motionSensor = new MotionSensorStub(true);
			const videoRecorder = new VideoRecorderSpy();
			const videoController = new VideoController(videoRecorder, motionSensor);

			videoController.checkSensor = jest.fn(videoController.checkSensor);

			videoController.start();
			jest.advanceTimersByTime(1000);
			expect(videoController.checkSensor).toHaveBeenCalledTimes(1);
			jest.advanceTimersByTime(1000);
			expect(videoController.checkSensor).toHaveBeenCalledTimes(2);
			jest.advanceTimersByTime(1000);
			expect(videoController.checkSensor).toHaveBeenCalledTimes(3);
		});
	});
});

describe('When the sensor throws an error', () => {
	class MotionSensorStub implements MotionSensor {
		constructor(private stubMotion: boolean) {}
		isDetectingMotion(): boolean {
			throw new Error();
		}
	}

	it('Should stop recording', async () => {
		const { VideoController } = await import('./videoController');
		const motionSensor = new MotionSensorStub(true);
		const videoRecorder = new VideoRecorderSpy();
		const videoController = new VideoController(videoRecorder, motionSensor);

		videoController.checkSensor();
		videoController.operateVideoRecording();

		expect(videoRecorder.isRecording).toBe(false);
	});
});
