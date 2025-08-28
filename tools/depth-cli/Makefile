.PHONY: setup run batch clean

VENV=.venv
PY=python3
ACT=. $(VENV)/bin/activate

setup:
	$(PY) -m venv $(VENV)
	$(ACT) && pip install -U pip wheel
	$(ACT) && pip install -r requirements.txt

run:
	$(ACT) && $(PY) depth_cli.py --help | cat

batch:
	$(ACT) && $(PY) depth_cli.py --input ./samples --output ./outputs --vis

clean:
	rm -rf $(VENV) __pycache__ outputs/*

