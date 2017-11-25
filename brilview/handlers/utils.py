from brilview import bvlogging
import traceback


def return_error_on_exception(func):
    def decorated(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            bvlogging.get_logger().warn(traceback.format_exc())
            return {
                'status': 'ERROR',
                'message': e.message
            }
    return decorated
