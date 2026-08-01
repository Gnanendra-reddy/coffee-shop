PENDING = "Pending"

PREPARING = "Preparing"

READY = "Ready"

OUT_FOR_DELIVERY = "Out for Delivery"

DELIVERED = "Delivered"

CANCELLED = "Cancelled"


VALID_STATUS_FLOW = {
    PENDING: [
        PREPARING,
        CANCELLED,
    ],

    PREPARING: [
        READY,
    ],

    READY: [
        OUT_FOR_DELIVERY,
    ],

    OUT_FOR_DELIVERY: [
        DELIVERED,
    ],

    DELIVERED: [],

    CANCELLED: [],
}