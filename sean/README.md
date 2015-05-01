Sean Warren's User Manual 
----

### v0.4.0.01 
----
## Added the ability to Double Click for Full Screen Mode
## Addded UI Changes
----

### pyspider/webui/static/debug.css
----
- [x] added an id called screen-setting


> I added the the id called screen-setting to control the color of the text I applied to let the user know they have entered either Full Screen Mode Left or Full Screen Mode Right, to beautify the UI for its new auto-hide feature.

### pyspider/webui/static/splitter.js
----
- [x] added variables AutoHideRight = false, autoHideLeft = false
- [x] removed unnecessary if statement in MoveSplitter Function

```javascript
 // if prev panel is too small and delta is negative, block
      if (prevSize < 100 && delta < 0) {
        // ignore
      } else if (elSize < 100 && delta > 0) {
        // ignore
      } else {
```
 - [x] added new function to bind double clicks on the id left-area and right-area

```javascript
$("#left-area, #right-area").bind('dblclick', function(e) {
+		var screenSize= {width: window.innerWidth || document.documentElement.clientWidth|| document.body.offsetWidth,heigh:window.						innerHeight||document.documentElement.clientHeight|| document.body.offsetHeight};	
+		var info = e;
+		
+		var selectedArea = info.currentTarget.attributes[0].nodeValue;
+		//console.log(selectedArea);
+		if (selectedArea == 'right-area'){
+			//console.log("we are in the right-area");
+				if (autoHideRight == false){
+				$("#control").css( "height", "44px");
+				$("#screen-setting").text("You are in Full Screen Mode - Right Area");
+				moveSplitter(1);
+				autoHideRight = true;}
+				else{ moveSplitter((screenSize.width)/2); autoHideRight = false;
+				$("#control").css( "height", "35px");
+				$("#screen-setting").text("");
+				}
+			}
+			else if(selectedArea =='left-area'){
+				if (autoHideLeft == false){
+					$("#control").css( "height", "44px");
+					$("#screen-setting").text("You are in Full Screen Mode - Left Area");
+					$("#save-task-btn").hide("slow");
+					moveSplitter((screenSize.width)-1);
+					autoHideLeft = true;}
+					else{ 
+					moveSplitter((screenSize.width)/2); autoHideLeft = false;
+					$("#control").css( "height", "35px");
+					$("#save-task-btn").show("slow");
+					$("#screen-setting").text("");
+					}
+						
+				//console.log("we are in the left-area");
+				}
+				else{
+					//console.log("ignore");
+					}
+	})
```

> I created a variable called screenSize to get the width of the browsers window. I also created another variable selectedArea, which uses the data coming from the binded function to tell me what area the user has pressed. Throughout
my new function I added JQuery code which changes the appearance of the UI when you Enter Full Screen Mode. 

### pyspider/webui/templates/debug.html
----
- [x] added a span tag to use with my jquery function on the debug template

```html
<center><span id="screen-setting"></span></center>
```

> Note: I used the depreciated <center> tag to implement the screen-setting information which changes dynamically.


### pyspider/webui/static/debug.css
----
- [x] changed the background color

> I changed the color of #python-log because our team felt like the UI didn't flow to well.

License
-------
Licensed under the Apache License, Version 2.0

