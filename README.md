# Luganodes SDE Hiring Task 2
## Create a Total Stake Counter for Cardano, Polkadot, and Kusama Chains

### Biswadeep Ray | 20BPS1165

### Installation
* RUN git clone https://github.com/RBiswa787/luganodes_task2_20bps1165.git
* RUN cd luganodes_task2_20bps1165
* RUN docker-compose build
* RUN docker-compose up
* Open http://localhost:5173 for frontend service

### Screenshots

<div style="display: flex; justify-content: flex-start">
    <img src="https://github.com/RBiswa787/luganodes_task2_20bps1165/blob/main/frontend/src/assets/landing_signup.png" alt="not available" />
    <img src="https://github.com/RBiswa787/luganodes_task2_20bps1165/blob/main/frontend/src/assets/landing_signin.png" alt="not available" />
    <img src="https://github.com/RBiswa787/luganodes_task2_20bps1165/blob/main/frontend/src/assets/latest_total_stake.png" alt="not available" />
</div>

#### Responsive Design

<div style="display: flex; justify-content: flex-start">
    <img src="https://github.com/RBiswa787/luganodes_task2_20bps1165/blob/main/frontend/src/assets/resp_landing_signup.png" alt="not available" />
    <img src="https://github.com/RBiswa787/luganodes_task2_20bps1165/blob/main/frontend/src/assets/resp_total_stake.png" alt="not available" />
</div>

#### How to use?
* If you are a new member, create an account on the landing page with username and password.
* Else, click on Sign In, and proceed with username and password.
* Use checkbox to select the blockchains you want to track and click Track.
* Selected chains' total staked amount will be visible in the dashboard.
* You can always change your choice of chains to track.

#### Data Source
* Cardano API Endpoint: https://js.cexplorer.io/api-static/pool/?poolBechId.json
* Luganodes Cardano Validator Pool ID: pool1qvudfuw9ar47up5fugs53s2g84q3c4v86z4es6uwsfzzs89rwha
  Source: https://medium.com/luganodes/cardano-how-to-stake-ada-tokens-with-lugandodes-36f197a407b6
* Polkadot API Endpoint: https://polkadot.api.subscan.io/api/scan/staking/validator/
* Polkadot Luganodes Validator Stash Address: 1vTaLKEyj2Wn9xEkUGixBkVXJAd4pzDgXzz9CuVjhVqhHRQ
  Source: https://medium.com/luganodes/polkadot-how-to-stake-dot-tokens-with-luganodes-b33f344e91eb
* Kusama API Endpoint: E8MByjWbS49hmzFM1U5rvFJES1Xgz1TSBAZLiYqZQiFTNUY
  Source: https://medium.com/luganodes/kusama-how-to-stake-ksm-tokens-with-luganodes-e322f56c7d0c

#### Features
* Username/Password based Authentication
* Token based Authorisation
* Responsive Design (Mobile Friendly)
* Track latest total staked amount by Luganodes validator on Cardano, Polkadot and Kusama chains.
* Entire application Containerised using Docker

#### Tech Stack
* Frontend: React.js (Vite)
* Backend Server: Node.js 
* Database: MongoDB
* Tools: Git, Docker, Thunder Client API Testing Tool

#### API Documentation
##### Create a New User

Description: This API endpoint allows you to create a new user with a unique username and password. If the username already exists in the database, it returns a 203 status code with an appropriate message.

Endpoint: Not specified (Assuming it's `/signup`)

HTTP Method: GET

Request Headers:

-   `Authorization`: Base64-encoded username and password in the format `Basic <base64(username:password)>`.

Request Body: None

Response:

-   `200 OK`: The user was successfully created, and a success message is returned.
-   `203 Non-Authoritative Information`: User already exists with the given username, and a corresponding message is returned.
-   `500 Internal Server Error`: If there was an issue while processing the request.

##### Find User and Generate Access Token

Description: This API endpoint allows you to find a user based on their provided username and password. If the user is found and the password matches, it generates a random access token for the user and updates it in the database. The endpoint returns information about the user, including the access token if successful.

Endpoint: '/signin'

HTTP Method: GET

Request Headers:

-   `Authorization`: Base64-encoded username and password in the format `Basic <base64(username:password)>`.

Request Body: None

Response:

-   `200 OK`: User found, password matched, and access token is generated. The response contains the access token and additional user details.
-   `203 Non-Authoritative Information`: User not found with the given username or password incorrect.
-   `500 Internal Server Error`: If there was an issue while processing the request.

##### Sign Out User

Description: This API endpoint allows a user to sign out by setting their access token to null in the database.

Endpoint: '/signout'

HTTP Method: POST

Request Body:

-   `username`: Username of the user to sign out.

Response:

-   `200 OK`: User successfully signed out, and a success message is returned.
-   `500 Internal Server Error`: If there was an issue while processing the request.

##### Update User Choices

Description: This API endpoint allows you to update a user's choice of chains to track in the database. It requires a valid `username` and `token`.

Endpoint: `/updatechains`

HTTP Method: POST

Request Body:

-   `username`: Username of the user to update chains.
-   `token`: Access token of the user.
-   `chains`: An array of integers representing the chains to update.

Response:

-   `200 OK`: Chains successfully updated, and a success message is returned.
-   `500 Internal Server Error`: If there was an issue while processing the request.

### Get Stake Data

Description: This API endpoint retrieves total staked amount data from three different sources based on the user's choice of chains to track. It uses an internal function called `process` to fetch the data from external APIs using Axios. The endpoint requires a valid `username` and `token`.

Endpoint:  `/getstakedata`

HTTP Method: POST

Request Body:

-   `username`: Username of the user to fetch stake data.
-   `token`: Access token of the user.

Response:

-   `200 OK`: The stake data retrieved successfully, and the response contains the data as an array.
-   `500 Internal Server Error`: If there was an issue while processing the request or if the token is invalid.