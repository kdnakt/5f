use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use aws_lambda_events::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use serde_json::json;
use http::{HeaderMap, HeaderValue};

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Extract some useful information from the request
    let roomId = event
        .query_string_parameters_ref()
        .and_then(|params| params.first("id"))
        .unwrap_or("RoomIdNotFound");
    println!("Looking for a room={roomId}");
    if roomId == "RoomIdNotFound" {
        let mut headers = HeaderMap::new();
        headers.insert("content-type", HeaderValue::from_static("application/json"));
        headers.insert("Access-Control-Allow-Origin", std::env::var("CORS_ORIGIN").expect("$CORS_ORIGIN is not set").parse().unwrap());
        let resp = ApiGatewayProxyResponse {
            status_code: 400,
            multi_value_headers: headers.clone(),
            body: Some("{'error': 'Bad Request'}".into()),
            headers,
        };
        return Ok(resp);
    }

    // TODO: getRoom(roomId) from DynamoDB

    // if room is not found, return 404
    
    // if room is found,
    // create random session id
    // add the session id to the room
    // update DynamoDB with the room
    // if update success, return 200, else 500

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(message.into())
        .map_err(Box::new)?;
    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
