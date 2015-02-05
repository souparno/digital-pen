
function startScript(canvasId)
{ 
	playbackInterruptCommand = "";
	
	$(document).bind("ready", function()
	{
		$("#pauseBtn").hide();
		//$("#playBtn").hide();
		
		drawing = new RecordableDrawing(canvasId);
		
		$("#recordBtn").click(function(){
			var btnTxt = $("#recordBtn").prop("value");
			if (btnTxt == 'Stop')
				stopRecording();
			else
				startRecording();
		});
		
		$("#playBtn").click(playRecordings);

		function playRecordings()
		{
			if (drawing.recordings.length == 0)
			{
				alert("No recording to play");
				return;
			}
			var btnTxt = $("#playBtn").prop("value");
			if (btnTxt == 'Stop')
				stopPlayback();
			else
				startPlayback();			
		}
		
		$("#pauseBtn").click(function(){
			var btnTxt = $("#pauseBtn").prop("value");
			if (btnTxt == 'Pause')
			{
				pausePlayback();
			} else if (btnTxt == 'Resume')
			{
				resumePlayback();
			}
		});
		$("#clearBtn").click(function(){
			drawing.clearCanvas();			
		});
	
		$("#serializeBtn").click(function() {
			var serResult = serializeDrawing(drawing);
			if (serResult != null)
			{
				$("#serDataTxt").val(serResult);
				showSerializerDiv();
			} else
			{
				alert("Error serializing data");
			}
		});

		function showSerializerDiv(showSubmit)
		{
			$("#drawingDiv").hide();
			$("#serializerDiv").show();	
			if (showSubmit)
				$("#okBtn").show();
			else
				$("#okBtn").hide();
		}

		function hideSerializerDiv()
		{
			$("#drawingDiv").show();
			$("#serializerDiv").hide();	
		}

		$("#deserializeBtn").click(function(){
			showSerializerDiv(true);
		});

		$("#cancelBtn").click(function(){
			hideSerializerDiv();
		});

		$("#okBtn").click(function(){
			var serTxt = $("#serDataTxt").val();
			var result = deserializeDrawing(serTxt);
			if (result == null)
				result = "Error : Unknown error in deserializing the data";
			if (result instanceof Array == false)
			{
				$("#serDataTxt").val(result.toString());
				showSerializerDiv(false);
				return;
			} 
			else
			{
				//data is successfully deserialize
				drawing.recordings = result;
				//set drawing property of each recording
				for (var i = 0; i < result.length; i++)
					result[i].drawing = drawing;
				hideSerializerDiv();
				playRecordings();
			}
		});
	});
	
	function stopRecording()
	{
		$("#recordBtn").prop("value","Record");
		$("#playBtn").show();
		$("#pauseBtn").hide();
		$("#clearBtn").show();
		
		drawing.stopRecording();
	}
	
	function startRecording()
	{
		$("#recordBtn").prop("value","Stop");
		$("#playBtn").hide();
		$("#pauseBtn").hide();
		$("#clearBtn").hide();
		
		drawing.startRecording();
	}
	
	function stopPlayback()
	{
		playbackInterruptCommand = "stop";		
	}
	
	function startPlayback()
	{
		drawing.playRecording(function() {
			//on playback start
			$("#playBtn").prop("value","Stop");
			$("#recordBtn").hide();
			$("#pauseBtn").show();
			$("#clearBtn").hide();
			playbackInterruptCommand = "";
		}, function(){
			//on playback end
			$("#playBtn").prop("value","Play");
			$("#playBtn").show();
			$("#recordBtn").show();
			$("#pauseBtn").hide();
			$("#clearBtn").show();
		}, function() {
			//on pause
			$("#pauseBtn").prop("value","Resume");
			$("#recordBtn").hide();
			$("#playBtn").hide();
			$("#clearBtn").hide();
		}, function() {
			//status callback
			return playbackInterruptCommand;
		});
	}
	
	function pausePlayback()
	{
		playbackInterruptCommand = "pause";
	}
	
	function resumePlayback()
	{
		playbackInterruptCommand = "";
		drawing.resumePlayback(function(){
			$("#pauseBtn").prop("value","Pause");
			$("#pauseBtn").show();
			$("#recordBtn").hide();
			$("#playBtn").show();
			$("#clearBtn").hide();
		});
	}
}