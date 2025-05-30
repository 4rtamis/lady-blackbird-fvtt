{
  description = "A Nix-flake-based Python + Node.js development environment";

  inputs.nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1";

  outputs = inputs: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      inputs.nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import inputs.nixpkgs {inherit system;};
        });

    version = "3.13";
  in {
    devShells = forEachSupportedSystem ({pkgs}: let
      concatMajorMinor = v:
        pkgs.lib.pipe v [
          pkgs.lib.versions.splitVersion
          (pkgs.lib.sublist 0 2)
          pkgs.lib.concatStrings
        ];
      python = pkgs."python${concatMajorMinor version}";
    in {
      default = pkgs.mkShell {
        venvDir = ".venv";

        postShellHook = ''
                        venvVersionWarn() {
                          local venvVersion
                          venvVersion="$("$venvDir/bin/python" -c 'import platform; print(platform.python_version())')"

                          [[ "$venvVersion" == "${python.version}" ]] && return

                          cat <<EOF
          Warning: Python version mismatch: [$venvVersion (venv)] != [${python.version}]
                   Delete '$venvDir' and reload to rebuild for version ${python.version}
          EOF
                        }

                        venvVersionWarn
        '';

        packages = with pkgs; [
          # Python environment
          python
          python.pkgs.venvShellHook
          python.pkgs.pip

          # Node.js + JS package managers
          nodejs
          nodePackages.pnpm
          yarn
          node2nix

          # Optional: linters or formatters
          # python.pkgs.black
          # python.pkgs.ruff
        ];
      };
    });
  };
}
