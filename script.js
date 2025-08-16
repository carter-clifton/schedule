document.getElementById("htmlFileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        loadContainers();
        const htmlContent = e.target.result;
        loadiframe(htmlContent);
    };
    reader.readAsText(file);
});

document.getElementById("timeColorPicker").addEventListener("input", function() {
    setTimeColor();
});

document.getElementById("timeBGColorPicker").addEventListener("input", function() {
    setTimeBGColor();
});

document.getElementById("dayColorPicker").addEventListener("input", function() {
    setDayColor();
});

document.getElementById("dayBGColorPicker").addEventListener("input", function() {
    setDayBGColor();
});

document.getElementById("backgroundColorPicker").addEventListener("input", function() {
    setBackgroundColor();
});

document.getElementById("dayFontPicker").addEventListener("input", function() {
    setDayFont();
});

document.getElementById("dayFontBoldCheckbox").addEventListener("input", function() {
    setDayFontBold();
});

document.getElementById("timeFontPicker").addEventListener("input", function() {
    setTimeFont();
});

document.getElementById("timeFontBoldCheckbox").addEventListener("input", function() {
    setTimeFontBold();
});

document.getElementById("courseFontPicker").addEventListener("input", function() {
    setCourseFont();
});

document.getElementById("courseFontBoldCheckbox").addEventListener("input", function() {
    setCourseFontBold();
});

document.getElementById("scheduleWidthRange").addEventListener("input", function() {
    setScheduleWidth();
});

document.getElementById("timeWidthRange").addEventListener("input", function() {
    setTimeWidth();
});

document.getElementById("dayFontSizeRange").addEventListener("input", function() {
    setDayFontSize();
});

document.getElementById("timeFontSizeRange").addEventListener("input", function() {
    setTimeFontSize();
});

document.getElementById("courseFontSizeRange").addEventListener("input", function() {
    setCourseFontSize();
});

document.getElementById("courseCenterCheckbox").addEventListener("input", function() {
    setCourseTextCentering();
});

var listOfCourses;
var splitCourses = {};

function resetValuesToDefault(arg) {
    if (arg || confirm("Are you sure you want to reset everything to the default values? This cannot be undone.")) {
        document.getElementById("dayColorPicker").value = "#000000";
        document.getElementById("dayBGColorPicker").value = "#E3E5EE";
        document.getElementById("timeColorPicker").value = "#000000";
        document.getElementById("timeBGColorPicker").value = "#FFFFFF";
        document.getElementById("backgroundColorPicker").value = "#FFFFFF";
        document.getElementById("dayFontPicker").value = "Verdana";
        document.getElementById("dayFontBoldCheckbox").checked = true;
        document.getElementById("timeFontPicker").value = "Verdana";
        document.getElementById("timeFontBoldCheckbox").checked = true;
        document.getElementById("courseFontPicker").value = "Verdana";
        document.getElementById("courseFontBoldCheckbox").checked = true;
        document.getElementById("scheduleWidthRange").value = 0;
        document.getElementById("timeWidthRange").value = 0;
        document.getElementById("dayFontSizeRange").value = 0;
        document.getElementById("timeFontSizeRange").value = 0;
        document.getElementById("courseFontSizeRange").value = 0;
        document.getElementById("courseCenterCheckbox").checked = false;
        setTimeColor();
        setTimeBGColor();
        setDayColor();
        setDayBGColor();
        setBackgroundColor();
        setDayFont();
        setDayFontBold();
        setTimeFont();
        setTimeFontBold();
        setCourseFont();
        setCourseFontBold();
        setScheduleWidth();
        setTimeWidth();
        resetCourseColors();
        setDayFontSize();
        setTimeFontSize();
        setCourseFontSize();
        resetCourseColorInputs();
        setCourseTextCentering();
    };
}

function helpButton() {
    alert("Help was pressed.")
}

function loadContainers() {
    document.getElementById("loadContainer").style.display = "none";
    document.getElementById("dualFrameContainer").style.display = "flex";
}

function setiframeFont(font) {
    document.getElementById("scheduleiframe").contentDocument.body.style.fontFamily = font;
}

function loadiframe(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const table = doc.querySelector("table.datadisplaytable");
    const iframe = document.getElementById("scheduleiframe");
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const tableWithoutWeekends = table.cloneNode(true);
    tableWithoutWeekends.querySelectorAll("tr").forEach(row => {
        const cells = row.querySelectorAll("th, td");
        if (cells.length >= 2) {
            cells[cells.length - 1].remove();
            cells[cells.length - 2].remove();
        }
    });
    iframeDoc.open();
    iframeDoc.write("<!DOCTYPE html><html><head><title>Extracted Table</title><link rel='stylesheet' href='schedStyle.css'></head><body>");
    if (table) {
        iframeDoc.write(tableWithoutWeekends.outerHTML);
    } else {
        iframeDoc.write("<p style='color: red;'>Error</p>");
    }
    iframeDoc.write("</body></html>");
    iframeDoc.close();
    listOfCourses = document.getElementById("scheduleiframe").contentDocument.querySelector("table.datadisplaytable").querySelectorAll("a");
    splitCoursesIntoClass();
    createCourseColoringButtons();
    resetValuesToDefault(true);
}

function setTimeColor() {
    const color = document.getElementById("timeColorPicker").value;
    const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
    for (let time of times) {
        if (time.nodeName.toLowerCase() === "th") {
            time.style.color = color;
        }
    }
}

function setTimeBGColor() {
    const color = document.getElementById("timeBGColorPicker").value;
    const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
    for (let time of times) {
        if (time.nodeName.toLowerCase() === "th") {
            time.style.backgroundColor = color;
        }
    }
}

function setDayColor() {
    const color = document.getElementById("dayColorPicker").value;
    const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
    for (let day of days) {
        day.style.color = color;
    }
}

function setDayBGColor() {
    const color = document.getElementById("dayBGColorPicker").value;
    const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
    for (let day of days) {
        day.style.backgroundColor = color;
    }
}

function setBackgroundColor() {
    const color = document.getElementById("backgroundColorPicker").value;
    document.getElementById("scheduleiframe").contentDocument.querySelector("table.datadisplaytable").style.backgroundColor = color;
}

function setDayFont() {
    const font = document.getElementById("dayFontPicker").value;
    const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
    for (let day of days) {
        day.style.fontFamily = font;
    }
}

function setDayFontBold() {
    if (!document.getElementById("dayFontBoldCheckbox").checked) {
        const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
        for (let day of days) {
            day.style.fontWeight = "normal";
        }
    } else {
        const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
        for (let day of days) {
            day.style.fontWeight = "bold";
        }
    }
}

function setTimeFont() {
    const font = document.getElementById("timeFontPicker").value;
    const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
    for (let time of times) {
        if (time.nodeName.toLowerCase() === "th") {
            time.style.fontFamily = font;
        }
    }
}

function setTimeFontBold() {
    if (!document.getElementById("timeFontBoldCheckbox").checked) {
        const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
        for (let time of times) {
            if (time.nodeName.toLowerCase() === "th") {
                time.style.fontWeight = "normal";
            }
        }
    } else {
        const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
        for (let time of times) {
            if (time.nodeName.toLowerCase() === "th") {
                time.style.fontWeight = "bold";
            }
        }
    }
}

function setCourseFont() {
    const font = document.getElementById("courseFontPicker").value;
    for (let course of listOfCourses) {
        course.style.fontFamily = font;
    }
}

function setCourseFontBold() {
    if (!document.getElementById("courseFontBoldCheckbox").checked) {
        for (let course of listOfCourses) {
            course.style.fontWeight = "normal";
        }
    } else {
        for (let course of listOfCourses) {
            course.style.fontWeight = "bold";
        }
    }
}

function setScheduleWidth() {
    const def = 80;
    const scalar = 1;
    const table = document.getElementById("scheduleiframe").contentDocument.querySelector("table.datadisplaytable");
    table.style.width = def + parseInt(document.getElementById("scheduleWidthRange").value) * scalar + "%";
}

function setTimeWidth() {
    const def = 53;
    const scalar = 10;
    const headers = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
    headers[0].style.width = def + parseInt(document.getElementById("timeWidthRange").value) * scalar + "px";
}

function resetCourseColors() {
    for (let course of listOfCourses) {
        course.style.color = "#0000ff";
    }
}

function setDayFontSize() {
    const days = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddheader");
    for (let day of days) {
        day.style.fontSize = 1 + parseInt(document.getElementById("dayFontSizeRange").value) * 0.1 + "em";
    }
}

function setTimeFontSize() {
    const times = document.getElementById("scheduleiframe").contentDocument.getElementsByClassName("ddlabel");
    for (let time of times) {
        if (time.nodeName.toLowerCase() === "th") {
            time.style.fontSize = 1 + parseInt(document.getElementById("timeFontSizeRange").value) * 0.1 + "em";
        }
    }
}

function setCourseFontSize() {
    for (let course of listOfCourses) {
        course.style.fontSize = 1 + parseInt(document.getElementById("courseFontSizeRange").value) * 0.1 + "em";
    }
}

function splitCoursesIntoClass() {
    for (let course of listOfCourses) {
        const courseName = course.innerHTML.split("<br>")[0];
        if (courseName in splitCourses) {
            splitCourses[courseName].push(course);
        } else {
            splitCourses[courseName] = [course];
        }
    }
}

function createCourseColoringButtons() {
    for (let course of Object.keys(splitCourses)) {
        const wrapper = document.createElement("div");
        wrapper.className = "mb-2 mt-2 valueContainer";
        const label = document.createElement("label");
        label.className = "form-label";
        label.textContent = `${course} Color:`;
        const input = document.createElement("input");
        input.type = "color";
        input.className = "form-control form-control-color";
        input.value = "#0000FF";
        input.id = course;
        input.title = "Choose your color";
        input.addEventListener("input", function() {
            changeCourseColor(course);
        })
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        document.getElementById("editingContainer").appendChild(wrapper);
    }
    const btmPad = document.createElement("div");
    btmPad.style.marginBottom = "10vh";
    document.getElementById("editingContainer").appendChild(btmPad);
}

function changeCourseColor(c) {
    const color = document.getElementById(c).value;
    for (let course of splitCourses[c]) {
        course.style.color = color;
    }
}

function resetCourseColorInputs() {
    for (let course of Object.keys(splitCourses)) {
        document.getElementById(course).value = "#0000FF";
    }
}

function setCourseTextCentering() {
    if (!document.getElementById("courseCenterCheckbox").checked) {
        for (let course of listOfCourses) {
            course.style.textAlign = "left"
        }
    } else {
        for (let course of listOfCourses) {
            course.style.textAlign = "center"
        }
    }
}

function save() {
    const table = document.getElementById("scheduleiframe").contentDocument.querySelector("table.datadisplaytable");
    html2canvas(table).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "schedule.png";
        link.click();
    });
}

function helpButton() {
    const modal = new bootstrap.Modal(document.getElementById('helpModal'));
    modal.show();
}