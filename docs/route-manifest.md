# Production route manifest

This is the PR 01 baseline for the static production output. The route list is
stored in [`route-manifest.json`](./route-manifest.json), and
`pnpm test:routes` validates every listed HTML route and generated file. The
check also confirms that the development-only `/design` fixture is absent from
production output and the sitemap.

## Primary routes

- `/`
- `/about`
- `/blog`
- `/contact`
- `/notes`

## Published content routes

- `/blog/denoising-diffusion-from-scratch`
- `/blog/improvement-plan`
- `/blog/llm-as-a-jailbreak-judge`
- `/blog/mistral-nemo-red-teamer`
- `/blog/variational-autoencoders-from-scratch`
- `/notes/corne-keyboard-5x3-3-setup`
- `/notes/cuda-mental-model`
- `/notes/hassle-free-ml-environment-with-nix-flakes`

Category, tag, RSS, Open Graph, and API outputs are recorded in the JSON
manifest. The route check prints the complete emitted HTML manifest after each
build.
