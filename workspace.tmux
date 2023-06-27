#!/bin/bash

tmux-workspace "AngularWS - Todos" "editor" -c "nvim && zsh" \
  -w "server" -c "ng serv --open && zsh"
