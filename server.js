const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the HTML files from your directory
app.use(express.static("D:/web"));

// Endpoint to handle form submission
app.post("/submit-form", async (req, res) => {
  const { name, email, contactNumber, address, area, occasion, message } = req.body;

  // Log the received data (optional)
  console.log("Form Data Received:", req.body);

  // Create a folder if it doesn't exist
  const dataFolderPath = path.join(__dirname, "customer_data");
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
  }

  // Create a file path for the customer data
  const filePath = path.join(dataFolderPath, `${Date.now()}.json`);

  // Prepare the data to be written into the file
  const customerData = {
    name,
    email,
    contactNumber,
    address,
    area,
    occasion,
    message,
    dateSubmitted: new Date().toISOString(),
  };

  // Write the customer data to a file
  fs.writeFile(filePath, JSON.stringify(customerData, null, 2), (err) => {
    if (err) {
      console.error("Error saving data:", err);
      return res.status(500).send("Failed to save customer data.");
    }
    console.log("Customer data saved:", filePath);
  });

  // Send email with the data
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "arghobhowmick31@gmail.com", // Replace with your email
        pass: "janina69..", // Replace with your email password
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: "your-email@gmail.com", // Replace with recipient email
      subject: "New Customer Form Submission",
      text: `
        New Customer Submission:
        Name: ${name}
        Email: ${email}
        Contact Number: ${contactNumber}
        Address: ${address}
        Area: ${area}
        Occasion: ${occasion}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Form data submitted, saved, and email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});