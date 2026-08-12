import gradio as gr
from main import app as fastapi_app

# Create a simple Gradio interface just to satisfy Hugging Face's requirements
demo = gr.Interface(
    fn=lambda: "Weather Whiplash API is running!",
    inputs=None,
    outputs="text",
    title="Weather Whiplash API"
)

# Mount the dummy Gradio app onto your existing FastAPI app
# We mount it at /gradio so it doesn't interfere with your /api routes
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")
