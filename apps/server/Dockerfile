FROM public.ecr.aws/lambda/nodejs:22


# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy the build output to the container
COPY dist/apps/server .

# Install production dependencies
RUN npm install --omit=dev


CMD [ "main.handler" ]