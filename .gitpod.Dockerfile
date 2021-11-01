FROM gitpod/workspace-full:latest

RUN bash -c ". .nvm/nvm.sh     && nvm install 14.08     && nvm use 14.08     && nvm alias default 14.08"

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix