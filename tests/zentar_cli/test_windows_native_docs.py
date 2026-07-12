from pathlib import Path


def test_windows_native_install_path_docs_match_installer() -> None:
    doc = Path("website/docs/user-guide/windows-native.md").read_text()
    install = Path("scripts/install.ps1").read_text()

    assert "%LOCALAPPDATA%\\zentar\\zentar-digital-agent\\venv\\Scripts" in doc
    assert "Get-Command zentar        # should print C:\\Users\\<you>\\AppData\\Local\\zentar\\zentar-digital-agent\\venv\\Scripts\\zentar.exe" in doc
    assert '$zentarBin = "$InstallDir\\venv\\Scripts"' in install
