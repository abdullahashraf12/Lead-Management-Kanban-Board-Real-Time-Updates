import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import KanBanData
from django.utils import timezone
import uuid
from channels.db import database_sync_to_async
from django.core.serializers.json import DjangoJSONEncoder

# Custom JSON encoder that handles datetime objects
class CustomJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'isoformat'):
            return obj.isoformat()
        return super().default(obj)

# Use database_sync_to_async to ensure these methods run asynchronously
@database_sync_to_async
def get_leads():
    leads = KanBanData.objects.all().values('id', 'name', 'email', 'phone', 'company', 'status', 'notes', 'created_at', 'updated_at')
    # Convert each lead to a dict with serialized dates
    return [
        {
            **lead,
            'id': str(lead['id']),
            'created_at': lead['created_at'].isoformat(),
            'updated_at': lead['updated_at'].isoformat()
        }
        for lead in leads
    ]

@database_sync_to_async
def update_lead(lead_data):
    try:
        # Ensure the ID exists and is numeric
        if 'id' not in lead_data or not str(lead_data['id']).isdigit():
            raise ValueError("Invalid or missing ID in lead data")
            
        lead_id = int(lead_data['id'])
        lead = KanBanData.objects.get(id=lead_id)
        
        # Update fields
        lead.name = lead_data.get('name', lead.name)
        lead.email = lead_data.get('email', lead.email)
        lead.phone = lead_data.get('phone', lead.phone)
        lead.company = lead_data.get('company', lead.company)
        lead.status = lead_data.get('status', lead.status)
        lead.notes = lead_data.get('notes', lead.notes)
        lead.updated_at = timezone.now()
        lead.save()
        
        return {
            'id': str(lead.id),
            'name': lead.name,
            'email': lead.email,
            'phone': lead.phone,
            'company': lead.company,
            'status': lead.status,
            'notes': lead.notes,
            'created_at': lead.created_at.isoformat(),
            'updated_at': lead.updated_at.isoformat()
        }
    except KanBanData.DoesNotExist:
        raise ValueError("Lead not found with the provided ID")
    except Exception as e:
        raise ValueError(f"Error updating lead: {str(e)}")
    
@database_sync_to_async
def add_lead(lead_data):
    try:
        # Create new lead with the provided data
        lead = KanBanData.objects.create(
            name=lead_data.get('name', ''),
            email=lead_data.get('email', ''),
            phone=lead_data.get('phone', ''),
            company=lead_data.get('company', ''),
            status=lead_data.get('status', 'new'),  # default status
            notes=lead_data.get('notes', ''),
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        
        # Return the lead data with the specified fields
        return {
            'id': str(lead.id),
            'name': lead.name,
            'email': lead.email,
            'phone': lead.phone,
            'company': lead.company,
            'status': lead.status,
            'notes': lead.notes,
            'created_at': lead.created_at.isoformat(),
            'updated_at': lead.updated_at.isoformat()
        }
    except Exception as e:
        raise ValueError(f"Error creating lead: {str(e)}")
class KanbanConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'kanban_room'
        self.room_group_name = f'kanban_{self.room_name}'

        # Join the WebSocket group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Get the leads data asynchronously
        leads_data = await get_leads()

        # Send the initial data when the WebSocket connects
        await self.send(text_data=json.dumps({
            'type': 'INITIAL_LEADS',
            'leads': leads_data,
        }, cls=CustomJSONEncoder))

    async def disconnect(self, close_code):
        # Leave the WebSocket group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data['type'] == 'UPDATE_LEAD':
            lead_data = data['lead']
            updated_lead = await update_lead(lead_data)
            
            # Broadcast updated lead to all WebSocket clients
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'lead_updated',
                    'lead': updated_lead,
                }
            )

        elif data['type'] == 'ADD_LEAD':
            new_lead_data = data['lead']
            new_lead = await add_lead(new_lead_data)
            
            # Broadcast the new lead to all WebSocket clients
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'lead_added',
                    'lead': new_lead,
                }
            )

    async def lead_updated(self, event):
        # Send the updated lead to WebSocket client
        await self.send(text_data=json.dumps({
            'type': 'LEAD_UPDATED',
            'lead': event['lead'],
        }, cls=CustomJSONEncoder))

    async def lead_added(self, event):
        # Send the added lead to WebSocket client
        await self.send(text_data=json.dumps({
            'type': 'LEAD_ADDED',
            'lead': event['lead'],
        }, cls=CustomJSONEncoder))
