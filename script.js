 const photoInput = document.getElementById("photoUpload");
    const preview = document.getElementById("preview");

    photoInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                preview.src = e.target.result;  // Image form par show ho jayegi
            }

            reader.readAsDataURL(file);
        }
    });
    // Same as Present Address checkbox functionality
    const checkbox = document.getElementById("sameAddress");

    checkbox.addEventListener("change", function () {

        if (this.checked) {
            // Copy values
            document.getElementById("permanentDivision").value =
                document.getElementById("presentDivision").value;

            document.getElementById("permanentDistrict").value =
                document.getElementById("presentDistrict").value;

            document.getElementById("permanentAddress").value =
                document.getElementById("presentAddress").value;
        } else {
            // Clear values if unchecked
            document.getElementById("permanentDivision").value = "";
            document.getElementById("permanentDistrict").value = "";
            document.getElementById("permanentAddress").value = "";
        }

    });
    // redio button unselect functionality
    const radios = document.querySelectorAll(".toggleRadio");

    radios.forEach(radio => {
        radio.addEventListener("click", function () {

            if (this.checked && this.wasChecked) {
                this.checked = false;   // Uncheck
                this.wasChecked = false;
            } else {
                radios.forEach(r => r.wasChecked = false);
                this.wasChecked = true;
            }

        });
    });
    // Signature Pad functionality
        const canvas = document.getElementById("signaturePad");
    const ctx = canvas.getContext("2d");

    let drawing = false;
    let hasSigned = false;

    // 🎯 Placeholder draw function
    function drawPlaceholder() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.fillText("Student Sign", canvas.width / 2, canvas.height / 2);
    }

    drawPlaceholder();

    // Mouse Events
    canvas.addEventListener("mousedown", () => {
        drawing = true;
        if (!hasSigned) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.beginPath();
        hasSigned = true;
    });

    canvas.addEventListener("mousemove", draw);

    function draw(event) {
        if (!drawing) return;

        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    }

    function clearSignature() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hasSigned = false;
        drawPlaceholder();
    }

    // ✅ Form Submit Validation
    document.querySelector("form").addEventListener("submit", function(e) {
        if (!hasSigned) {
            alert("Please provide your signature before submitting the form.");
            e.preventDefault();
            return;
        }

        // 🎯 Convert Signature to Image Base64
        const signatureImage = canvas.toDataURL("image/png");
        console.log("Signature Image:", signatureImage);

        // Optional: Hidden input me store karna
        let hiddenInput = document.getElementById("signatureData");
        if (!hiddenInput) {
            hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "signatureData";
            hiddenInput.id = "signatureData";
            document.querySelector("form").appendChild(hiddenInput);
        }
        hiddenInput.value = signatureImage;
    });

    // PDF Upload Functionality
    const pdfInput = document.getElementById("pdfUpload");
    const pdfPreview = document.getElementById("pdfPreview");
    const pdfFileName = document.getElementById("pdfFileName");

    if (pdfInput) {
        pdfInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file && file.type === "application/pdf") {
                console.log("PDF File selected:", file.name);
                
                // Visual feedback
                if (pdfPreview && pdfFileName) {
                    pdfPreview.style.display = "block";
                    pdfFileName.textContent = file.name;
                    hasSigned = true; // Consider the signature provided if they upload
                }
            } else {
                alert("Please select a valid PDF file.");
                this.value = ""; // Reset input
                if (pdfPreview) pdfPreview.style.display = "none";
            }
        });
    }