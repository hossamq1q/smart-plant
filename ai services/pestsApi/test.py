import cv2
print([fourcc for fourcc in dir(cv2.VideoWriter_fourcc) if not fourcc.startswith('_')])