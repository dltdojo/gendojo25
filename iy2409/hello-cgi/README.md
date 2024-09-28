---
title: Simple CGI Application with Busybox and Docker Compose
date: 2023-11-20
description: This project demonstrates a basic CGI application using Busybox as a web server and Docker Compose for deployment.  It showcases how to perform simple calculations server-side and display the results in a web page.
keywords: cgi, busybox, docker, compose, web server, javascript, html
---

# Simple CGI Application with Busybox and Docker Compose

This project demonstrates a basic CGI application using Busybox's built-in HTTP server and Docker Compose for deployment. The application allows users to add two numbers via a web interface. The addition operation is performed by a CGI script (cgiapp.sh) written in shell script.

## How it works

1. **Web Server:** Busybox's `httpd` serves as a simple web server, serving the `index.html` file and handling requests to the `/cgi-bin` directory.

2. **CGI Script:** The `cgiapp.sh` script resides in the `/cgi-bin` directory within the Docker container. This script takes two parameters, `a` and `b`, from the query string, calculates their sum, and returns the result as plain text.

3. **Frontend (index.html):** The `index.html` file provides a simple interface with two number input fields and a button. When the button is clicked, a JavaScript function makes a fetch request to the `cgiapp.sh` script, passing the input values as query parameters. The response from the script is then displayed on the page.

4. **Docker Compose:** `docker compose.yaml` orchestrates the setup. It defines a service named `mytest` that uses the `busybox` image.  It maps port 8300 on the host to port 3000 in the container, mounts the necessary files (index.html, app.sh, cgi-app.sh), and sets the command to start the Busybox HTTP server using `app.sh`.

## Running the application

1. Make sure you have Docker and Docker Compose installed.

2. Clone this repository:

   ```bash
   git clone <repository_url>
   ```

3. Navigate to the project directory:

   ```bash
   cd hello-cgi
   ```

4. Start the application using Docker Compose:

   ```bash
   docker compose up -d
   ```

5. Open your web browser and go to `http://localhost:8300`.

6. Enter two numbers in the input fields and click the button. The sum should be displayed below. You can also click the provided link to see a pre-set example.


## Files Explained

- **app.sh:**  This script starts the Busybox HTTP server and sets execute permissions for the CGI script.
- **cgi-app.sh:**  This is the CGI script that performs the addition operation. It parses the query string and outputs the result.
- **compose.yaml:**  The Docker Compose file for defining and running the application.
- **index.html:**  The HTML file that provides the user interface.


## Improvements and Considerations

- **Error Handling:** The CGI script currently lacks robust error handling.  It should be enhanced to handle cases where the input parameters are not valid numbers.
- **Security:** In a production environment, consider using a more secure web server and implementing proper security measures.
- **More Complex Logic:** This example demonstrates a very simple calculation. CGI scripts can be used for more complex tasks, but for more demanding applications, consider using a more robust framework.